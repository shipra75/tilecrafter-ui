'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from '../utils/api'
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FontManager() {
  const [fonts, setFonts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchFonts()
  }, [])

  const fetchFonts = async () => {
    try {
      setLoading(true)
      const data = await api.fonts.listFonts()'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from '../utils/api'
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FontManager() {
  const [fonts, setFonts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchFonts()
  }, [])

  const fetchFonts = async () => {
    try {
      setLoading(true)
      const data = await api.fonts.listFonts()
      setFonts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch fonts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
            {fonts.map((font) => (
              <TableRow key={font.name}>
                <TableCell>{font.name}</TableCell>
                <TableCell>{font.allowedRanges}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => api.fonts.getFont(font.name, '0-255', font.name)}
                    disabled={loading}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}


      setFonts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch fonts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
            {fonts.map((font) => (
              <TableRow key={font.name}>
                <TableCell>{font.name}</TableCell>
                <TableCell>{font.allowedRanges}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => api.fonts.getFont(font.name, '0-255', font.name)}
                    disabled={loading}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

