"use client";

import { Mail, MapPin, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactInput } from "@/lib/validators";

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(_data: ContactInput) {
    await new Promise((r) => setTimeout(r, 1000));
    reset();
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">Contact</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Entrons en <span className="gradient-text">contact</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Une question, une suggestion ou un projet ? N&apos;hésitez pas à me contacter.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">contact@wabtechs.com</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Localisation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Kinshasa, RD Congo</p>
              </CardContent>
            </Card>
          </div>

          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Input placeholder="Votre nom" {...register("name")} />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Input type="email" placeholder="Votre email" {...register("email")} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Input placeholder="Sujet" {...register("subject")} />
                  {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
                </div>
                <div className="space-y-2">
                  <Textarea placeholder="Votre message" rows={5} {...register("message")} />
                  {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
