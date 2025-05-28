"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Grid3X3, Plus, Minus } from "lucide-react"

interface MatrixInputHelperProps {
  onMatrixGenerated: (matrix: string, vector: string) => void
}

export function MatrixInputHelper({ onMatrixGenerated }: MatrixInputHelperProps) {
  const [size, setSize] = useState(3)
  const [matrix, setMatrix] = useState<number[][]>(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(0)),
  )
  const [vector, setVector] = useState<number[]>(Array(3).fill(0))

  const updateSize = (newSize: number) => {
    if (newSize < 2 || newSize > 6) return

    setSize(newSize)

    // Redimensionar matriz
    const newMatrix = Array(newSize)
      .fill(null)
      .map((_, i) =>
        Array(newSize)
          .fill(null)
          .map((_, j) => (matrix[i] && matrix[i][j] !== undefined ? matrix[i][j] : 0)),
      )

    // Redimensionar vector
    const newVector = Array(newSize)
      .fill(null)
      .map((_, i) => (vector[i] !== undefined ? vector[i] : 0))

    setMatrix(newMatrix)
    setVector(newVector)
  }

  const updateMatrixValue = (i: number, j: number, value: string) => {
    const newMatrix = [...matrix]
    newMatrix[i][j] = Number.parseFloat(value) || 0
    setMatrix(newMatrix)
  }

  const updateVectorValue = (i: number, value: string) => {
    const newVector = [...vector]
    newVector[i] = Number.parseFloat(value) || 0
    setVector(newVector)
  }

  const generateRandomMatrix = () => {
    const newMatrix = Array(size)
      .fill(null)
      .map((_, i) =>
        Array(size)
          .fill(null)
          .map((_, j) => {
            if (i === j) {
              // Diagonal principal: valores más grandes para asegurar convergencia
              return Math.round((Math.random() * 8 + 2) * 100) / 100
            } else {
              // Elementos fuera de la diagonal: valores más pequeños
              return Math.round((Math.random() * 2 - 1) * 100) / 100
            }
          }),
      )

    const newVector = Array(size)
      .fill(null)
      .map(() => Math.round((Math.random() * 10 - 5) * 100) / 100)

    setMatrix(newMatrix)
    setVector(newVector)
  }

  const generateMatrixStrings = () => {
    const matrixString = matrix.map((row) => row.join(",")).join("\n")
    const vectorString = vector.join(",")
    onMatrixGenerated(matrixString, vectorString)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3X3 className="h-5 w-5" />
          Generador de Matrices
        </CardTitle>
        <CardDescription>Crea matrices y vectores de forma visual para probar los métodos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Label>Tamaño de la matriz:</Label>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => updateSize(size - 1)} disabled={size <= 2}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{size}</span>
            <Button variant="outline" size="sm" onClick={() => updateSize(size + 1)} disabled={size >= 6}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={generateRandomMatrix}>
            Generar Aleatoria
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-semibold">Matriz A</Label>
            <div className="mt-2 space-y-2">
              {matrix.map((row, i) => (
                <div key={i} className="flex gap-2">
                  {row.map((value, j) => (
                    <Input
                      key={j}
                      type="number"
                      step="0.01"
                      value={value}
                      onChange={(e) => updateMatrixValue(i, j, e.target.value)}
                      className="w-16 text-center"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">Vector b</Label>
            <div className="mt-2 space-y-2">
              {vector.map((value, i) => (
                <Input
                  key={i}
                  type="number"
                  step="0.01"
                  value={value}
                  onChange={(e) => updateVectorValue(i, e.target.value)}
                  className="w-20"
                />
              ))}
            </div>
          </div>
        </div>

        <Button onClick={generateMatrixStrings} className="w-full">
          Usar esta Matriz en los Métodos
        </Button>
      </CardContent>
    </Card>
  )
}
