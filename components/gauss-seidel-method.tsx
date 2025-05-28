"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calculator } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as numeric from "numericjs"

interface GaussSeidelMethodProps {
  onResult: (result: any) => void
}

export function GaussSeidelMethod({ onResult }: GaussSeidelMethodProps) {
  const [matrix, setMatrix] = useState("")
  const [vector, setVector] = useState("")
  const [initialGuess, setInitialGuess] = useState("")
  const [tolerance, setTolerance] = useState("0.001")
  const [maxIterations, setMaxIterations] = useState("100")
  const [result, setResult] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [errorType, setErrorType] = useState("infinito")

  const gaussSeidelSolve = (
    A: number[][],
    b: number[],
    x0: number[],
    tol: number,
    maxIter: number,
    errorType: string,
  ) => {
    const n = A.length
    let x = [...x0]
    let iterations = 0
    let error = Number.POSITIVE_INFINITY
    const iterationHistory = []

    // Calculate spectral radius
    const calculateSpectralRadius = (A: number[][]) => {
      const eigenvalues = numeric.eig(A).lambda.x
      const absoluteEigenvalues = eigenvalues.map((eigenvalue: number) => Math.abs(eigenvalue))
      return Math.max(...absoluteEigenvalues)
    }

    const isDiagonallyDominant = (matrix: number[][]) => {
      for (let i = 0; i < matrix.length; i++) {
        let rowSum = 0
        for (let j = 0; j < matrix[i].length; j++) {
          if (i !== j) {
            rowSum += Math.abs(matrix[i][j])
          }
        }
        if (Math.abs(matrix[i][i]) <= rowSum) {
          return false
        }
      }
      return true
    }

    let spectralRadius = 0

    if (n <= 10) {
      try {
        const D = numeric.diag(A.map((row, i) => row[i]))
        const L = numeric.sub(D, numeric.tri(A))
        const U = numeric.sub(D, numeric.triu(A))
        const T = numeric.dot(numeric.inv(numeric.sub(D, L)), U)

        spectralRadius = calculateSpectralRadius(T)
      } catch (error) {
        console.error("Error calculating spectral radius:", error)
        spectralRadius = Number.NaN
      }
    } else {
      spectralRadius = Number.NaN
    }

    while (error > tol && iterations < maxIter) {
      const x_new = Array(n).fill(0)

      for (let i = 0; i < n; i++) {
        let sum1 = 0
        for (let j = 0; j < i; j++) {
          sum1 += A[i][j] * x_new[j]
        }

        let sum2 = 0
        for (let j = i + 1; j < n; j++) {
          sum2 += A[i][j] * x[j]
        }

        x_new[i] = (b[i] - sum1 - sum2) / A[i][i]
      }

      if (errorType === "infinito") {
        error = Math.max(...x_new.map((val, i) => Math.abs(val - x[i])))
      } else if (errorType === "euclídea") {
        error = Math.sqrt(x_new.reduce((acc, val, i) => acc + Math.pow(val - x[i], 2), 0))
      } else {
        error = Math.max(...x_new.map((val, i) => Math.abs((val - x[i]) / val)))
      }

      iterations++
      iterationHistory.push({
        iteration: iterations,
        solution: [...x_new],
        error: error,
      })
      x = [...x_new]
    }

    return {
      solution: x,
      iterations,
      error,
      converged: error <= tol,
      history: iterationHistory,
      spectralRadius: spectralRadius,
      isDiagonallyDominant: isDiagonallyDominant(A),
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
      const result = gaussSeidelSolve(A, b, x0, tol, maxIter, errorType)
      const endTime = performance.now()
      const executionTime = endTime - startTime

      const finalResult = {
        ...result,
        executionTime,
        method: "Gauss-Seidel",
      }

      setResult(finalResult)
      onResult(finalResult)
    } catch (error) {
      console.error("Error en cálculo Gauss-Seidel:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Método de Gauss-Seidel
        </CardTitle>
        <CardDescription>Método iterativo mejorado que usa valores actualizados inmediatamente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gauss-matrix">Matriz A (separar filas con enter, columnas con comas)</Label>
            <textarea
              id="gauss-matrix"
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="2,-1,0&#10;-1,2,-1&#10;0,-1,2"
              value={matrix}
              onChange={(e) => setMatrix(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gauss-vector">Vector b (separar con comas)</Label>
              <Input id="gauss-vector" placeholder="1,0,1" value={vector} onChange={(e) => setVector(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gauss-guess">Aproximación inicial (separar con comas)</Label>
              <Input
                id="gauss-guess"
                placeholder="0,0,0"
                value={initialGuess}
                onChange={(e) => setInitialGuess(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="gauss-tolerance">Tolerancia</Label>
                <Input
                  id="gauss-tolerance"
                  type="number"
                  step="0.001"
                  value={tolerance}
                  onChange={(e) => setTolerance(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gauss-iterations">Máx. Iteraciones</Label>
                <Input
                  id="gauss-iterations"
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
                  <SelectItem value="infinito">Infinito</SelectItem>
                  <SelectItem value="euclídea">Euclídea</SelectItem>
                  <SelectItem value="relativo">Relativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button onClick={handleCalculate} disabled={isCalculating} className="w-full">
          {isCalculating ? "Calculando..." : "Ejecutar Método de Gauss-Seidel"}
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
                {!isNaN(result.spectralRadius) && (
                  <div>
                    <strong>Radio Espectral:</strong> {result.spectralRadius.toFixed(6)}
                  </div>
                )}
                <div>
                  <strong>Es Diagonalmente Dominante:</strong> {result.isDiagonallyDominant ? "Sí" : "No"}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
