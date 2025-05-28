import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Calculator, Target } from "lucide-react"

export default function HomePage() {
  const integrantes = ["Andrés Suárez", "Alejandro Zapata", "Marcelo Castro", "Samuel Alarcón", "Juan Pablo Mejía"]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Bienvenidos al Proyecto Final de Análisis Numérico</h1>
        <p className="text-xl text-muted-foreground">
          Comparación y evaluación de métodos numéricos organizados por capítulos
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Integrantes del Proyecto
            </CardTitle>
            <CardDescription>Equipo de desarrollo del proyecto final</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {integrantes.map((integrante, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  {integrante}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objetivo del Proyecto
            </CardTitle>
            <CardDescription>Propósito y alcance del análisis</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Mediante una división de capítulos, evaluamos varios métodos que tienen una finalidad similar y comparamos
              cuál método es mejor en cada capítulo, proporcionando análisis detallados y reportes comparativos.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-lg">Capítulo 1</CardTitle>
            <CardDescription>Métodos de aproximación</CardDescription>
          </CardHeader>
          <CardContent>
            <BookOpen className="h-8 w-8 mx-auto text-muted-foreground" />
          </CardContent>
        </Card>

        <Card className="text-center border-primary">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Capítulo 2</CardTitle>
            <CardDescription>Sistemas de ecuaciones lineales</CardDescription>
          </CardHeader>
          <CardContent>
            <Calculator className="h-8 w-8 mx-auto text-primary" />
            <p className="text-xs text-muted-foreground mt-2">Jacobi, Gauss-Seidel, SOR</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-lg">Capítulo 3</CardTitle>
            <CardDescription>Interpolación</CardDescription>
          </CardHeader>
          <CardContent>
            <BookOpen className="h-8 w-8 mx-auto text-muted-foreground" />
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-lg">Capítulo 4</CardTitle>
            <CardDescription>Integración numérica</CardDescription>
          </CardHeader>
          <CardContent>
            <BookOpen className="h-8 w-8 mx-auto text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
