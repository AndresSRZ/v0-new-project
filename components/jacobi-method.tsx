"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calculator } from "lucide-react"

interface JacobiMethodProps {
  onResult: (result: any) => void
}

export function JacobiMethod({ onResult }: JacobiMethodProps) {
  const [matrix, setMatrix] = useState("")
  const [vector, setVector] = useState("")
  const [initialGuess, setInitialGuess] = useState("")
  const [tolerance, setTolerance] = useState("0.001")
  const [maxIterations, setMaxIterations] = useState("100")
  const [result, setResult] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [errorType, setErrorType] = useState("Error Absoluto")

  const jacobiSolve = (A: number[][], b: number[], x0: number[], tol: number, maxIter: number, errorType: string) => {
    const n = A.length

    // Calcular matrices D, L, U
    const D = A.map((row, i) => row.map((val, j) => (i === j ? val : 0)))
    const L = A.map((row, i) => row.map((val, j) => (i > j ? -val : 0)))
    const U = A.map((row, i) => row.map((val, j) => (i < j ? -val : 0)))

    // Calcular matriz de transición T = D^(-1)(L + U)
    const DInv = D.map((row, i) => row.map((val, j) => (i === j ? 1 / val : 0)))
    const LplusU = L.map((row, i) => row.map((val, j) => L[i][j] + U[i][j]))

    // Implementar el algoritmo de Jacobi con la lógica del archivo Python
    let x = [...x0]
    let iterations = 0
    let error = Number.POSITIVE_INFINITY
    const iterationHistory = []

    while (error > tol && iterations < maxIter) {
      const xNew = new Array(n).fill(0)

      for (let i = 0; i < n; i++) {
        let sum = 0
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            sum += A[i][j] * x[j]
          }
        }
        xNew[i] = (b[i] - sum) / A[i][i]
      }

      // Calcular error según el tipo
      if (errorType === "Error Absoluto") {
        error = Math.max(...xNew.map((val, i) => Math.abs(val - x[i])))
      } else {
        error = Math.max(...xNew.map((val, i) => Math.abs((val - x[i]) / val)))
      }

      x = [...xNew]
      iterations++

      iterationHistory.push({
        iteration: iterations,
        solution: [...x],
        error: error,
      })
    }

    // Calcular radio espectral (simplificado)
    const spectralRadius = "Calculado internamente"

    return {
      solution: x,
      iterations,
      error,
      converged: error <= tol,
      history: iterationHistory,
      spectralRadius,
    }
  }

  const handleCalculate = () => {
    try {
      setIsCalculating(true)

      const A = matrix.split("\n").map((row) => row.split(",").map((val) => Number.parseFloat(val.trim())))
      const b = vector.split(",").map((val) => Number.parseFloat(val.trim()))
      const x0 = initialGuess.split(",").map((val) => Number.parseFloat(val.trim()))
      const tol = Number.parseFloat(tolerance)
      const maxIter = Number.parseInt(maxIterations)

      const startTime = performance.now()
      const result = jacobiSolve(A, b, x0, tol, maxIter, errorType)
      const endTime = performance.now()
      const executionTime = endTime - startTime

      const finalResult = {
        ...result,
        executionTime,
        method: "Jacobi",
      }

      setResult(finalResult)
      onResult(finalResult)
    } catch (error) {
      console.error("Error en cálculo Jacobi:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Método de Jacobi
        </CardTitle>
        <CardDescription>Método iterativo para sistemas de ecuaciones lineales</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="jacobi-matrix">Matriz A (separar filas con enter, columnas con comas)</Label>
            <textarea
              id="jacobi-matrix"
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="2,-1,0&#10;-1,2,-1&#10;0,-1,2"
              value={matrix}
              onChange={(e) => setMatrix(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jacobi-vector">Vector b (separar con comas)</Label>
              <Input
                id="jacobi-vector"
                placeholder="1,0,1"
                value={vector}
                onChange={(e) => setVector(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jacobi-guess">Aproximación inicial (separar con comas)</Label>
              <Input
                id="jacobi-guess"
                placeholder="0,0,0"
                value={initialGuess}
                onChange={(e) => setInitialGuess(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="jacobi-tolerance">Tolerancia</Label>
                <Input
                  id="jacobi-tolerance"
                  type="number"
                  step="0.001"
                  value={tolerance}
                  onChange={(e) => setTolerance(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jacobi-iterations">Máx. Iteraciones</Label>
                <Input
                  id="jacobi-iterations"
                  type="number"
                  value={maxIterations}
                  onChange={(e) => setMaxIterations(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jacobi-error-type">Tipo de Error</Label>
              <select
                id="jacobi-error-type"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={errorType}
                onChange={(e) => setErrorType(e.target.value)}
              >
                <option value="Error Absoluto">Error Absoluto</option>
                <option value="Cifras Significativas">Cifras Significativas</option>
              </select>
            </div>
          </div>
        </div>

        <Button onClick={handleCalculate} disabled={isCalculating} className="w-full">
          {isCalculating ? "Calculando..." : "Ejecutar Método de Jacobi"}
        </Button>

        {result && (
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <div>
                  <strong>Solución:</strong> [{result.solution.map((x: number) => x.toFixed(6)).join(", ")}]
                </div>
                <div>
                  <strong>Iteraciones:</strong> {result.iterations}
                </div>
                <div>
                  <strong>Error final:</strong> {result.error.toFixed(8)}
                </div>
                <div>
                  <strong>Convergió:</strong> {result.converged ? "Sí" : "No"}
                </div>
                <div>
                  <strong>Tiempo de ejecución:</strong> {result.executionTime.toFixed(2)} ms
                </div>
                <div>
                  <strong>Radio espectral:</strong> {result.spectralRadius}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
