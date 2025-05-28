"use client"

import type React from "react"

import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface BarChartProps {
  data: any[]
  children?: React.ReactNode
}

export function BarChart({ data, children }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data}>{children}</RechartsBarChart>
    </ResponsiveContainer>
  )
}

export { Bar, XAxis, YAxis }
