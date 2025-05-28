"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ActivityIcon as Function } from "lucide-react"

export function DerivativeCalculator() {
  const [functionInput, setFunctionInput] = useState("")
  const [point, setPoint] = useState("")
  const [method, setMethod] = useState("forward")
  const [h, setH] = useState("0.001")
  const [result, setResult] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Evaluador de funciones simple
  const evaluateFunction = (func: string, x: number): number => {
    try {
      // Reemplazar funciones matemáticas comunes
      const expression = func
        .replace(/\bsin\b/g, "Math.sin")
        .replace(/\bcos\b/g, "Math.cos")
        .replace(/\btan\b/g, "Math.tan")
        .replace(/\bexp\b/g, "Math.exp")
        .replace(/\bln\b/g, "Math.log")
        .replace(/\blog\b/g, "Math.log10")
        .replace(/\bsqrt\b/g, "Math.sqrt")
        .replace(/\babs\b/g, "Math.abs")
        .replace(/\bpi\b/g, "Math.PI")
        .replace(/\be\b/g, "Math.E")
        .replace(/\^/g, "**")
        .replace(/\bx\b/g, x.toString())

      return eval(expression)
    } catch (error) {
      throw new Error("Error al evaluar la función")
    }
  }

  const calculateDerivative = () => {
    try {
      setIsCalculating(true)

      const x = Number.parseFloat(point)
      const stepSize = Number.parseFloat(h)

      let derivative: number
      let methodName: string

      switch (method) {
        case "forward":
          // Diferencia hacia adelante: f'(x) ≈ (f(x+h) - f(x)) / h
          derivative = (evaluateFunction(functionInput, x + stepSize) - evaluateFunction(functionInput, x)) / stepSize
          methodName = "Diferencia hacia adelante"
          break

        case "backward":
          // Diferencia hacia atrás: f'(x) ≈ (f(x) - f(x-h)) / h
          derivative = (evaluateFunction(functionInput, x) - evaluateFunction(functionInput, x - stepSize)) / stepSize
          methodName = "Diferencia hacia atrás"
          break

        case "central":
          // Diferencia central: f'(x) ≈ (f(x+h) - f(x-h)) / (2h)
          derivative =
            (evaluateFunction(functionInput, x + stepSize) - evaluateFunction(functionInput, x - stepSize)) /
            (2 * stepSize)
          methodName = "Diferencia central"
          break

        default:
          throw new Error("Método no válido")
      }

      setResult({
        derivative,
        method: methodName,
        point: x,
        stepSize,
        functionValue: evaluateFunction(functionInput, x),
      })
    } catch (error) {
      console.error("Error en cálculo de derivada:", error)
      setResult({
        error: "Error al calcular la derivada. Verifica la función y los parámetros.",
      })
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Function className="h-5 w-5" />
          Calculadora de Derivadas
        </CardTitle>
        <CardDescription>Calcula la derivada numérica de una función en un punto específico</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="function">Función f(x)</Label>
              <Input
                id="function"
                placeholder="x^2 + 2*x + 1"
                value={functionInput}
                onChange={(e) => setFunctionInput(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Usa: sin, cos, tan, exp, ln, log, sqrt, abs, pi, e, ^</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="point">Punto de evaluación (x)</Label>
              <Input
                id="point"
                type="number"
                step="0.1"
                placeholder="1"
                value={point}
                onChange={(e) => setPoint(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="method">Método de diferenciación</Label>
              <select
                id="method"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="forward">Diferencia hacia adelante</option>
                <option value="backward">Diferencia hacia atrás</option>
                <option value="central">Diferencia central</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="step-size">Tamaño de paso (h)</Label>
              <Input
                id="step-size"
                type="number"
                step="0.0001"
                placeholder="0.001"
                value={h}
                onChange={(e) => setH(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button onClick={calculateDerivative} disabled={isCalculating} className="w-full">
          {isCalculating ? "Calculando..." : "Calcular Derivada"}
        </Button>

        {result && (
          <Alert className={result.error ? "border-red-200" : "border-green-200"}>
            <AlertDescription>
              {result.error ? (
                <div className="text-red-600">{result.error}</div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <strong>Método:</strong> {result.method}
                  </div>
                  <div>
                    <strong>f({result.point}) =</strong> {result.functionValue.toFixed(8)}
                  </div>
                  <div>
                    <strong>f'({result.point}) ≈</strong> {result.derivative.toFixed(8)}
                  </div>
                  <div>
                    <strong>Tamaño de paso:</strong> {result.stepSize}
                  </div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <AlertDescription>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Ejemplos de funciones:</strong>
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <code>x^2 + 2*x + 1</code> - Polinomio cuadrático
                </li>
                <li>
                  <code>sin(x)</code> - Función seno
                </li>
                <li>
                  <code>exp(x)</code> - Función exponencial
                </li>
                <li>
                  <code>ln(x)</code> - Logaritmo natural
                </li>
                <li>
                  <code>sqrt(x^2 + 1)</code> - Función con raíz cuadrada
                </li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
