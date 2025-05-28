"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PlayCircle } from "lucide-react"

interface SimultaneousExecutionProps {
  onResults: (results: any[]) => void
}

export function SimultaneousExecution({ onResults }: SimultaneousExecutionProps) {
  const [matrix, setMatrix] = useState("")
  const [vector, setVector] = useState("")
  const [initialGuess, setInitialGuess] = useState("")
  const [omega, setOmega] = useState("1.2")
  const [tolerance, setTolerance] = useState("0.001")
  const [maxIterations, setMaxIterations] = useState("100")
  const [results, setResults] = useState<any[]>([])
  const [isCalculating, setIsCalculating] = useState(false)

  const jacobiSolve = (A: number[][], b: number[], x0: number[], tol: number, maxIter: number) => {
    const n = A.length
    let x = [...x0]
    const xNew = new Array(n).fill(0)
    let iterations = 0
    let error = Number.POSITIVE_INFINITY

    while (error > tol && iterations < maxIter) {
      for (let i = 0; i < n; i++) {
        let sum = 0
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            sum += A[i][j] * x[j]
          }
        }
        xNew[i] = (b[i] - sum) / A[i][i]
      }

      error = Math.max(...xNew.map((val, i) => Math.abs(val - x[i])))
      x = [...xNew]
      iterations++
    }

    return { solution: x, iterations, error, converged: error <= tol }
  }

  const gaussSeidelSolve = (A: number[][], b: number[], x0: number[], tol: number, maxIter: number) => {
    const n = A.length
    const x = [...x0]
    let iterations = 0
    let error = Number.POSITIVE_INFINITY

    while (error > tol && iterations < maxIter) {
      const xOld = [...x]

      for (let i = 0; i < n; i++) {
        let sum = 0
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            sum += A[i][j] * x[j]
          }
        }
        x[i] = (b[i] - sum) / A[i][i]
      }

      error = Math.max(...x.map((val, i) => Math.abs(val - xOld[i])))
      iterations++
    }

    return { solution: x, iterations, error, converged: error <= tol }
  }

  const sorSolve = (A: number[][], b: number[], x0: number[], w: number, tol: number, maxIter: number) => {
    const n = A.length
    const x = [...x0]
    let iterations = 0
    let error = Number.POSITIVE_INFINITY

    while (error > tol && iterations < maxIter) {
      const xOld = [...x]

      for (let i = 0; i < n; i++) {
        let sum = 0
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            sum += A[i][j] * x[j]
          }
        }
        const xNew = (b[i] - sum) / A[i][i]
        x[i] = (1 - w) * x[i] + w * xNew
      }

      error = Math.max(...x.map((val, i) => Math.abs(val - xOld[i])))
      iterations++
    }

    return { solution: x, iterations, error, converged: error <= tol, omega: w }
  }

  const handleSimultaneousExecution = () => {
    try {
      setIsCalculating(true)

      const A = matrix.split("\n").map((row) => row.split(",").map((val) => Number.parseFloat(val.trim())))
      const b = vector.split(",").map((val) => Number.parseFloat(val.trim()))
      const x0 = initialGuess.split(",").map((val) => Number.parseFloat(val.trim()))
      const w = Number.parseFloat(omega)
      const tol = Number.parseFloat(tolerance)
      const maxIter = Number.parseInt(maxIterations)

      // Ejecutar Jacobi
      const startJacobi = performance.now()
      const jacobiResult = jacobiSolve(A, b, x0, tol, maxIter)
      const endJacobi = performance.now()

      // Ejecutar Gauss-Seidel
      const startGauss = performance.now()
      const gaussResult = gaussSeidelSolve(A, b, x0, tol, maxIter)
      const endGauss = performance.now()

      // Ejecutar SOR
      const startSOR = performance.now()
      const sorResult = sorSolve(A, b, x0, w, tol, maxIter)
      const endSOR = performance.now()

      const allResults = [
        {
          method: "Jacobi",
          ...jacobiResult,
          executionTime: endJacobi - startJacobi,
        },
        {
          method: "Gauss-Seidel",
          ...gaussResult,
          executionTime: endGauss - startGauss,
        },
        {
          method: "SOR",
          ...sorResult,
          executionTime: endSOR - startSOR,
        },
      ]

      setResults(allResults)
      onResults(allResults)
    } catch (error) {
      console.error("Error en ejecución simultánea:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlayCircle className="h-5 w-5" />
          Ejecución Simultánea de Todos los Métodos
        </CardTitle>
        <CardDescription>
          Ejecuta Jacobi, Gauss-Seidel y SOR con los mismos parámetros para comparar resultados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sim-matrix">Matriz A (separar filas con enter, columnas con comas)</Label>
            <textarea
              id="sim-matrix"
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="2,-1,0&#10;-1,2,-1&#10;0,-1,2"
              value={matrix}
              onChange={(e) => setMatrix(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sim-vector">Vector b (separar con comas)</Label>
              <Input id="sim-vector" placeholder="1,0,1" value={vector} onChange={(e) => setVector(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sim-guess">Aproximación inicial (separar con comas)</Label>
              <Input
                id="sim-guess"
                placeholder="0,0,0"
                value={initialGuess}
                onChange={(e) => setInitialGuess(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="sim-omega">Factor ω (SOR)</Label>
                <Input
                  id="sim-omega"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="2"
                  value={omega}
                  onChange={(e) => setOmega(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sim-tolerance">Tolerancia</Label>
                <Input
                  id="sim-tolerance"
                  type="number"
                  step="0.001"
                  value={tolerance}
                  onChange={(e) => setTolerance(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sim-iterations">Máx. Iteraciones</Label>
                <Input
                  id="sim-iterations"
                  type="number"
                  value={maxIterations}
                  onChange={(e) => setMaxIterations(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleSimultaneousExecution} disabled={isCalculating} className="w-full">
          {isCalculating ? "Ejecutando todos los métodos..." : "Ejecutar Todos los Métodos"}
        </Button>

        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resultados Comparativos</h3>
            {results.map((result, index) => (
              <Alert key={index}>
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-semibold">{result.method}</div>
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
                      <strong>Tiempo:</strong> {result.executionTime.toFixed(2)} ms
                    </div>
                    {result.omega && (
                      <div>
                        <strong>Factor ω:</strong> {result.omega}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
