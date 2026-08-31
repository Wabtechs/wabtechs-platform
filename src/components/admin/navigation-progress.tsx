"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function NavigationProgress() {
	const [loading, setLoading] = useState(false);
	const loadingRef = useRef(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		setLoading(false);
		loadingRef.current = false;
	}, []);

	const handleStart = useCallback(() => {
		if (loadingRef.current) return;
		loadingRef.current = true;
		// Defer state update to avoid useInsertionEffect error
		timeoutRef.current = setTimeout(() => {
			setLoading(true);
		}, 0);
	}, []);

	const handleComplete = useCallback(() => {
		if (!loadingRef.current) return;
		loadingRef.current = false;
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		const originalPushState = window.history.pushState;
		const originalReplaceState = window.history.replaceState;

		window.history.pushState = function (...args) {
			handleStart();
			return originalPushState.apply(this, args);
		};

		window.history.replaceState = function (...args) {
			handleStart();
			return originalReplaceState.apply(this, args);
		};

		window.addEventListener("popstate", handleStart);

		return () => {
			window.history.pushState = originalPushState;
			window.history.replaceState = originalReplaceState;
			window.removeEventListener("popstate", handleStart);
			handleComplete();
		};
	}, [handleStart, handleComplete]);

	if (!loading) return null;

	return (
		<div className="fixed left-0 top-0 z-[100] h-0.5 w-full overflow-hidden bg-transparent">
			<div className="h-full w-[40%] animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-primary" />
			<style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
		</div>
	);
}
