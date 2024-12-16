'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from '../utils/api'
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StyleManager() {
  const [styles, setStyles] = useState([])
  const [styleName, setStyleName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStyles()
  }, [])

  const fetchStyles = async () => {
    try {
      setLoading(true)
      const data = await api.styles.getAll()
      setStyles(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch styles",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddStyle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      setLoading(true)
      await api.styles.add(styleName, file)
      toast({
        title: "Success",
        description: "Style added successfully",
      })
      setStyleName('')
      setFile(null)
      fetchStyles()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add style",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Style</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddStyle} className="space-y-4">
            <div>
              <Label htmlFor="styleName">Style Name</Label>
              <Input
                id="styleName"
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
                placeholder="Enter style name"
              />
            </div>
            <div>
              <Label htmlFor="styleFile">Upload Style File</Label>
              <Input
                id="styleFile"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Style'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Existing Styles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Style Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {styles.map((style) => (
                <TableRow key={style.name}>
                  <TableCell>{style.name}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => api.styles.getStyle(style.name)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

