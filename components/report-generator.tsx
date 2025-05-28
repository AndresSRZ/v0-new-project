"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, X, Trophy, Clock, Target } from "lucide-react"

interface ReportGeneratorProps {
  results: any[]
  onClose: () => void
}

export function ReportGenerator({ results, onClose }: ReportGeneratorProps) {
  const getBestMethod = () => {
    if (results.length === 0) return null

    // Filtrar métodos que convergieron
    const convergedMethods = results.filter((r) => r.converged)

    if (convergedMethods.length === 0) {
      return {
        method: "Ninguno",
        reason: "Ningún método convergió",
      }
    }

    // Encontrar el método con menos iteraciones entre los convergidos
    const bestByIterations = convergedMethods.reduce((best, current) =>
      current.iterations < best.iterations ? current : best,
    )

    // Encontrar el método más rápido entre los convergidos
    const bestByTime = convergedMethods.reduce((best, current) =>
      current.executionTime < best.executionTime ? current : best,
    )

    // Encontrar el método con menor error entre los convergidos
    const bestByError = convergedMethods.reduce((best, current) => (current.error < best.error ? current : best))

    return {
      method: bestByIterations.method,
      reason: `Menor número de iteraciones (${bestByIterations.iterations})`,
      byTime: bestByTime.method,
      byError: bestByError.method,
      details: {
        iterations: bestByIterations,
        time: bestByTime,
        error: bestByError,
      },
    }
  }

  const bestMethod = getBestMethod()

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Informe de Comparación de Métodos</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Análisis comparativo de la ejecución de los métodos numéricos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumen de ejecución */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Resumen de Ejecución</h3>
          <div className="grid gap-4">
            {results.map((result, index) => (
              <Alert key={index} className={result.converged ? "border-green-200" : "border-red-200"}>
                <AlertDescription>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-semibold text-lg">{result.method}</div>
                      <div className="space-y-1 text-sm">
                        <div>
                          <strong>Estado:</strong> {result.converged ? "✅ Convergió" : "❌ No convergió"}
                        </div>
                        <div>
                          <strong>Iteraciones:</strong> {result.iterations}
                        </div>
                        <div>
                          <strong>Error final:</strong> {result.error.toFixed(8)}
                        </div>
                        <div>
                          <strong>Tiempo:</strong> {result.executionTime.toFixed(2)} ms
                        </div>
                        {result.omega && (
                          <div>
                            <strong>Factor ω:</strong> {result.omega}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm">
                        <strong>Solución encontrada:</strong>
                        <div className="font-mono text-xs mt-1 p-2 bg-muted rounded">
                          [{result.solution.map((x: number) => x.toFixed(6)).join(", ")}]
                        </div>
                      </div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>

        {/* Mejor método */}
        {bestMethod && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Análisis del Mejor Método
            </h3>
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertDescription>
                <div className="space-y-3">
                  <div>
                    <strong className="text-lg">Mejor método general: {bestMethod.method}</strong>
                    <p className="text-sm text-muted-foreground mt-1">{bestMethod.reason}</p>
                  </div>

                  {bestMethod.details && (
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-semibold">Menos iteraciones</div>
                          <div>{bestMethod.details.iterations.method}</div>
                          <div className="text-xs text-muted-foreground">
                            {bestMethod.details.iterations.iterations} iteraciones
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-500" />
                        <div>
                          <div className="font-semibold">Más rápido</div>
                          <div>{bestMethod.details.time.method}</div>
                          <div className="text-xs text-muted-foreground">
                            {bestMethod.details.time.executionTime.toFixed(2)} ms
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-500" />
                        <div>
                          <div className="font-semibold">Menor error</div>
                          <div>{bestMethod.details.error.method}</div>
                          <div className="text-xs text-muted-foreground">
                            {bestMethod.details.error.error.toFixed(8)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Conclusiones */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Conclusiones</h3>
          <Alert>
            <AlertDescription>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Convergencia:</strong> {results.filter((r) => r.converged).length} de {results.length} métodos
                  convergieron exitosamente.
                </p>
                {results.some((r) => r.method === "SOR") && (
                  <p>
                    <strong>Factor SOR:</strong> El factor ω utilizado fue{" "}
                    {results.find((r) => r.method === "SOR")?.omega}.
                    {results.find((r) => r.method === "SOR")?.omega === 1 && " (Equivalente a Gauss-Seidel)"}
                    {results.find((r) => r.method === "SOR")?.omega < 1 && " (Sub-relajación)"}
                    {results.find((r) => r.method === "SOR")?.omega > 1 && " (Sobre-relajación)"}
                  </p>
                )}
                <p>
                  <strong>Recomendación:</strong> Para problemas similares, se recomienda usar el método{" "}
                  {bestMethod?.method}
                  debido a su {bestMethod?.reason.toLowerCase()}.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  )
}
