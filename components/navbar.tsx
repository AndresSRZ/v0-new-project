"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HelpCircle, Home, Calculator } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Calculator className="h-6 w-6" />
              <span className="font-bold">Análisis Numérico</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Inicio
              </Button>
            </Link>

            <Link href="/capitulo1">
              <Button variant="ghost" size="sm">
                Capítulo 1
              </Button>
            </Link>

            <Link href="/capitulo2">
              <Button variant="ghost" size="sm">
                Capítulo 2
              </Button>
            </Link>

            <Link href="/capitulo3">
              <Button variant="ghost" size="sm">
                Capítulo 3
              </Button>
            </Link>

            <Link href="/capitulo4">
              <Button variant="ghost" size="sm">
                Capítulo 4
              </Button>
            </Link>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Ayuda
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ayuda General</DialogTitle>
                  <DialogDescription>Información importante para el uso de los métodos numéricos</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Tolerancia</h4>
                    <p className="text-sm text-muted-foreground">
                      En los métodos que piden tolerancia, esta debe ser positiva (mayor que 0).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Número de Iteraciones</h4>
                    <p className="text-sm text-muted-foreground">
                      En los métodos que piden número de iteraciones, este debe ser positivo (mayor que 0).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Cálculo de Derivadas</h4>
                    <p className="text-sm text-muted-foreground">
                      Puedes calcular derivadas según una función ingresada por pantalla en la sección correspondiente.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </nav>
  )
}
