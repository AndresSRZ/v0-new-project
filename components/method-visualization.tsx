"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { BarChart3 } from "lucide-react"

interface MethodVisualizationProps {
  results: any[]
}

export function MethodVisualization({ results }: MethodVisualizationProps) {
  if (!results || results.length === 0) return null

  // Preparar datos para el gráfico de convergencia
  const convergenceData = results.map((result, index) => ({
    method: result.method,
    iterations: result.iterations,
    error: result.error,
    time: result.executionTime,
    converged: result.converged ? 1 : 0,
  }))

  // Preparar datos para el gráfico de iteraciones vs error
  const getIterationData = () => {
    if (results[0]?.history) {
      return results[0].history.map((item: any) => ({
        iteration: item.iteration,
        error: Math.log10(item.error), // Escala logarítmica para mejor visualización
      }))
    }
    return []
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comparación de Métodos
          </CardTitle>
          <CardDescription>Visualización del rendimiento de cada método</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-2">Iteraciones por Método</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={convergenceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="iterations" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Tiempo de Ejecución (ms)</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={convergenceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="time" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {getIterationData().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Convergencia del Primer Método</CardTitle>
            <CardDescription>Error vs Iteraciones (escala logarítmica)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getIterationData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="iteration" />
                <YAxis label={{ value: "log₁₀(Error)", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(value: any) => [Math.pow(10, value).toExponential(2), "Error"]} />
                <Legend />
                <Line type="monotone" dataKey="error" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
