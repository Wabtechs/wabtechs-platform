export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Calendar, MapPin, Video } from "lucide-react";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Événements",
  description: "Prochains événements, meetups et activités communautaires Wabtechs.",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function EventsPage() {
  let events: Awaited<ReturnType<typeof db.event.findMany>> = [];
  try {
    events = await db.event.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
    });
  } catch (error) {
    console.error("[events] Base de données indisponible:", error);
  }

  const now = new Date();
  const upcomingEvents = events.filter((e) => e.date && e.date >= now);
  const pastEvents = events.filter((e) => !e.date || e.date < now);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Événements"
          title="Événements"
          highlight="& Meetups"
          description="Prochains événements, ateliers et rencontres communautaires."
        />

        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">À venir</h2>
          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="transition-all hover:shadow-lg">
                <CardHeader className="flex flex-row gap-4">
                  <div className="bg-primary/10 text-primary flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge variant={event.type === "online" ? "secondary" : "default"}>
                        {event.type === "online" ? (
                          <>
                            <Video className="mr-1 h-3 w-3" /> En ligne
                          </>
                        ) : (
                          <>
                            <MapPin className="mr-1 h-3 w-3" /> Sur place
                          </>
                        )}
                      </Badge>
                    </div>
                    {event.description && (
                      <CardDescription className="mt-1">{event.description}</CardDescription>
                    )}
                    <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-4 text-sm">
                      {event.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(event.date)}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  {event.url && (
                    <Button asChild variant="outline" size="sm" className="shrink-0">
                      <a href={event.url} target="_blank" rel="noopener noreferrer">
                        S&apos;inscrire
                      </a>
                    </Button>
                  )}
                </CardHeader>
              </Card>
            ))}
            {upcomingEvents.length === 0 && (
              <p className="text-muted-foreground py-8 text-center">Aucun événement à venir.</p>
            )}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">Événements passés</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-80">
                <CardHeader>
                  <CardTitle className="text-base">{event.title}</CardTitle>
                  {event.description && <CardDescription>{event.description}</CardDescription>}
                  <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
                    {event.date && <span>{formatDate(event.date)}</span>}
                    {event.location && <span>{event.location}</span>}
                  </div>
                </CardHeader>
              </Card>
            ))}
            {pastEvents.length === 0 && (
              <p className="text-muted-foreground col-span-2 py-8 text-center">
                Aucun événement passé.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
