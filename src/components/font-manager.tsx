'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from '../utils/api'
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FontManager() {
  const [fonts, setFonts] = useState<string[]>([])

  useEffect(() => {
    fetchFonts()
  }, [])

  const fetchFonts = async () => {
    try {
      const data = await api.fonts?.listFonts?.()
      if (!data) throw new Error("No fonts returned")
      const fontList = Object.keys(data)
      setFonts(fontList)
    } catch (error) {
      console.error("Fetch fonts error", error)
      toast({
        title: "Error",
        description: "Failed to fetch fonts",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Fonts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Font Name</TableHead>
              <TableHead>Allowed Ranges</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fonts.map((font, index) => {
              const [name, range] = typeof font === 'string' ? font.split('/') : ['Unknown', '']
              return (
                <TableRow key={font}> {/* or `${font}-${index}` if needed */}
                  <TableCell>{name}</TableCell>
                  <TableCell>{range}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => api.fonts.getFont(name, '0-255', name)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
