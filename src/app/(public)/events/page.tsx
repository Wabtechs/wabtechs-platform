import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Calendar, Clock, MapPin, Users, Video } from "lucide-react";

export const metadata: Metadata = {
  title: "Événements",
  description: "Prochains événements, meetups et activités communautaires WabTechs.",
};

const UPCOMING_EVENTS = [
  {
    title: "WabTechs Meetup #1",
    description: "Premier meetup communautaire à Kinshasa. Présentations lightning talks, networking et pizza.",
    date: "15 Août 2026",
    time: "18h00 - 21h00",
    location: "Kinshasa, RD Congo",
    type: "in-person" as const,
    capacity: 50,
    registered: 32,
  },
  {
    title: "Live Coding : Build in Public",
    description: "Session live de développement d'une feature complète de zéro. Questions et interaction avec le chat.",
    date: "22 Août 2026",
    time: "20h00 - 22h00",
    location: "YouTube Live",
    type: "online" as const,
    capacity: null,
    registered: 89,
  },
  {
    title: "Workshop Prisma & PostgreSQL",
    description: "Atelier pratique sur Prisma ORM — schema design, migrations, queries avancées et performance.",
    date: "5 Septembre 2026",
    time: "14h00 - 17h00",
    location: "YouTube Live",
    type: "online" as const,
    capacity: 100,
    registered: 45,
  },
  {
    title: "WabTechs Meetup #2",
    description: "Deuxième meetup avec présentations sur Next.js 16, React 19 et les Server Components.",
    date: "20 Septembre 2026",
    time: "18h00 - 21h00",
    location: "Kinshasa, RD Congo",
    type: "in-person" as const,
    capacity: 50,
    registered: 18,
  },
];

const PAST_EVENTS = [
  {
    title: "Lancement WabTechs Platform",
    description: "Événement de lancement de la plateforme avec démo live et discussion communautaire.",
    date: "1 Juillet 2026",
    attendees: 120,
    recording: "#",
  },
  {
    title: "Workshop TypeScript Strict Mode",
    description: "Atelier sur TypeScript strict — noUncheckedIndexedAccess, discriminated unions et type guards.",
    date: "15 Juin 2026",
    attendees: 67,
    recording: "#",
  },
];

export default function EventsPage() {
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
          <h2 className="text-2xl font-bold tracking-tight mb-8">À venir</h2>
          <div className="space-y-6">
            {UPCOMING_EVENTS.map((event) => (
              <Card key={event.title} className="transition-all hover:shadow-lg">
                <CardHeader className="flex flex-row gap-4">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge variant={event.type === "online" ? "secondary" : "default"}>
                        {event.type === "online" ? (
                          <><Video className="mr-1 h-3 w-3" /> En ligne</>
                        ) : (
                          <><MapPin className="mr-1 h-3 w-3" /> Sur place</>
                        )}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">{event.description}</CardDescription>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {event.registered}{event.capacity ? `/${event.capacity}` : ""} inscrits
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0">
                    S&apos;inscrire
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Événements passés</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {PAST_EVENTS.map((event) => (
              <Card key={event.title} className="opacity-80">
                <CardHeader>
                  <CardTitle className="text-base">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{event.date}</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {event.attendees} participants
                    </span>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
