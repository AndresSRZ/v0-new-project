"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calculator } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SORMethodProps {
  onResult: (result: any) => void
}

export function SORMethod({ onResult }: SORMethodProps) {
  const [matrix, setMatrix] = useState("")
  const [vector, setVector] = useState("")
  const [initialGuess, setInitialGuess] = useState("")
  const [omega, setOmega] = useState("1.2")
  const [tolerance, setTolerance] = useState("0.001")
  const [maxIterations, setMaxIterations] = useState("100")
  const [result, setResult] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [errorType, setErrorType] = useState("absolute")

  const sorSolve = (
    A: number[][],
    b: number[],
    x0: number[],
    w: number,
    tol: number,
    maxIter: number,
    errorType: string,
  ) => {
    const n = A.length
    const x = [...x0]
    let iterations = 0
    let error = Number.POSITIVE_INFINITY
    const iterationHistory = []

    while (error > tol && iterations < maxIter) {
      const xOld = [...x]

      for (let i = 0; i < n; i++) {
        let sum = 0
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            sum += A[i][j] * x[j]
          }
        }
        x[i] = (1 - w) * xOld[i] + (w / A[i][i]) * (b[i] - sum)
      }

      if (errorType === "absolute") {
        error = Math.max(...x.map((val, i) => Math.abs(val - xOld[i])))
      } else {
        error = Math.max(...x.map((val, i) => Math.abs((val - xOld[i]) / val)))
      }

      iterations++

      iterationHistory.push({
        iteration: iterations,
        solution: [...x],
        error: error,
      })
    }

    const D = A.map((row, i) => row.map((val, j) => (i === j ? val : 0)))
    const L = A.map((row, i) => row.map((val, j) => (i > j ? -val : 0)))
    const U = A.map((row, i) => row.map((val, j) => (i < j ? -val : 0)))

    // Calculate spectral radius
    const T = D.map((row, i) => row.map((val, j) => (1 - w) * (i === j ? 1 : 0) - w * (D[i][j] + w * L[i][j])))

    // Approximate spectral radius (simplified, might not be accurate for all matrices)
    const eigenvalues = A.map((row, i) => row[i]) // Diagonal elements as approximation
    const spectralRadius = Math.max(...eigenvalues.map(Math.abs))

    return {
      solution: x,
      iterations,
      error,
      converged: error <= tol,
      history: iterationHistory,
      omega: w,
      spectralRadius: spectralRadius,
    }
  }

  const handleCalculate = () => {
    try {
      setIsCalculating(true)

      const A = matrix.split("\n").map((row) => row.split(",").map((val) => Number.parseFloat(val.trim())))
      const b = vector.split(",").map((val) => Number.parseFloat(val.trim()))
      const x0 = initialGuess.split(",").map((val) => Number.parseFloat(val.trim()))
      const w = Number.parseFloat(omega)
      const tol = Number.parseFloat(tolerance)
      const maxIter = Number.parseInt(maxIterations)

      const startTime = performance.now()
      const result = sorSolve(A, b, x0, w, tol, maxIter, errorType)
      const endTime = performance.now()
      const executionTime = endTime - startTime

      const finalResult = {
        ...result,
        executionTime,
        method: "SOR",
      }

      setResult(finalResult)
      onResult(finalResult)
    } catch (error) {
      console.error("Error en cálculo SOR:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Método SOR (Successive Over-Relaxation)
        </CardTitle>
        <CardDescription>Método de sobre-relajación sucesiva con factor de relajación ω</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sor-matrix">Matriz A (separar filas con enter, columnas con comas)</Label>
            <textarea
              id="sor-matrix"
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="2,-1,0&#10;-1,2,-1&#10;0,-1,2"
              value={matrix}
              onChange={(e) => setMatrix(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sor-vector">Vector b (separar con comas)</Label>
              <Input id="sor-vector" placeholder="1,0,1" value={vector} onChange={(e) => setVector(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sor-guess">Aproximación inicial (separar con comas)</Label>
              <Input
                id="sor-guess"
                placeholder="0,0,0"
                value={initialGuess}
                onChange={(e) => setInitialGuess(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="sor-omega">Factor ω</Label>
                <Input
                  id="sor-omega"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="2"
                  value={omega}
                  onChange={(e) => setOmega(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sor-tolerance">Tolerancia</Label>
                <Input
                  id="sor-tolerance"
                  type="number"
                  step="0.001"
                  value={tolerance}
                  onChange={(e) => setTolerance(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sor-iterations">Máx. Iteraciones</Label>
                <Input
                  id="sor-iterations"
                  type="number"
                  value={maxIterations}
                  onChange={(e) => setMaxIterations(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Error</Label>
              <Select onValueChange={setErrorType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar tipo de error" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="absolute">Absoluto</SelectItem>
                  <SelectItem value="relative">Relativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button onClick={handleCalculate} disabled={isCalculating} className="w-full">
          {isCalculating ? "Calculando..." : "Ejecutar Método SOR"}
        </Button>

        {result && (
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <div>
                  <strong>Solución:</strong> [{result.solution.map((x: number) => x.toFixed(6)).join(", ")}]
                </div>
                <div>
                  <strong>Factor ω:</strong> {result.omega}
                </div>
                <div>
                  <strong>Iteraciones:</strong> {result.iterations}
                </div>
                <div>
                  <strong>Error final:</strong> {result.error.toFixed(8)}
                </div>
                <div>
                  <strong>Radio Espectral:</strong> {result.spectralRadius.toFixed(8)}
                </div>
                <div>
                  <strong>Convergió:</strong> {result.converged ? "Sí" : "No"}
                </div>
                <div>
                  <strong>Tiempo de ejecución:</strong> {result.executionTime.toFixed(2)} ms
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
