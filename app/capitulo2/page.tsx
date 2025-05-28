"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Info, FileText } from "lucide-react"
import { JacobiMethod } from "@/components/jacobi-method"
import { GaussSeidelMethod } from "@/components/gauss-seidel-method"
import { SORMethod } from "@/components/sor-method"
import { SimultaneousExecution } from "@/components/simultaneous-execution"
import { ReportGenerator } from "@/components/report-generator"
import { DerivativeCalculator } from "@/components/derivative-calculator"
import { MethodVisualization } from "@/components/method-visualization"
import { MatrixInputHelper } from "@/components/matrix-input-helper"

export default function Capitulo2Page() {
  const [results, setResults] = useState<any[]>([])
  const [showReport, setShowReport] = useState(false)

  const handleMethodResult = (methodName: string, result: any) => {
    setResults((prev) => {
      const filtered = prev.filter((r) => r.method !== methodName)
      return [...filtered, { method: methodName, ...result }]
    })
  }

  const handleGenerateReport = () => {
    if (results.length > 0) {
      setShowReport(true)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Capítulo 2: Sistemas de Ecuaciones Lineales</h1>
        <p className="text-muted-foreground">
          Métodos iterativos para la resolución de sistemas de ecuaciones lineales
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="space-y-2">
          <div>
            <strong>Requisitos importantes:</strong>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              El determinante de la matriz debe ser diferente de 0.
              <a
                href="https://matrixcalc.org/es/det.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 ml-1"
              >
                Averigua el determinante aquí
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>La matriz no debe tener 0's en la diagonal principal.</li>
            <li>
              <strong>SOR:</strong> Si w=1, trabajará como Gauss-Seidel.
            </li>
            <li>
              <strong>SOR:</strong> Si 0&lt;w&lt;1, métodos de sub-relajación (para convergencia de sistemas no
              convergentes por Gauss-Seidel).
            </li>
            <li>
              <strong>SOR:</strong> Si 1&lt;w&lt;2, métodos de sobre-relajación (para acelerar convergencia lenta de
              Gauss-Seidel).
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      <MatrixInputHelper
        onMatrixGenerated={(matrixStr, vectorStr) => {
          // Esta función se puede usar para llenar automáticamente los campos
          console.log("Matriz generada:", matrixStr, vectorStr)
        }}
      />

      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Ejecución Individual</TabsTrigger>
          <TabsTrigger value="simultaneous">Ejecución Simultánea</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-6">
          <div className="grid gap-6">
            <JacobiMethod onResult={(result) => handleMethodResult("Jacobi", result)} />
            <GaussSeidelMethod onResult={(result) => handleMethodResult("Gauss-Seidel", result)} />
            <SORMethod onResult={(result) => handleMethodResult("SOR", result)} />
          </div>
        </TabsContent>

        <TabsContent value="simultaneous" className="space-y-6">
          <SimultaneousExecution onResults={setResults} />
        </TabsContent>
      </Tabs>

      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Visualización de Resultados</h2>
          <MethodVisualization results={results} />
        </div>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generar Informe Comparativo
            </CardTitle>
            <CardDescription>Compara los resultados de todos los métodos ejecutados</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerateReport} className="w-full">
              Generar Informe de Comparación
            </Button>
          </CardContent>
        </Card>
      )}

      {showReport && <ReportGenerator results={results} onClose={() => setShowReport(false)} />}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Calculadora de Derivadas</h2>
        <DerivativeCalculator />
      </div>
    </div>
  )
}
