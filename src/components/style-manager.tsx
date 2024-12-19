"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "../utils/api"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

export function StyleManager() {
  const [styles, setStyles] = useState<any[]>([])
  const [styleName, setStyleName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentStyle, setCurrentStyle] = useState<any>(null)

  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)

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
      setStyleName("")
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

  const handleViewStyle = async (name: string) => {
    try {
      setLoading(true)
      const styleData = await api.styles.getStyle(name)
      setCurrentStyle(styleData)
      setIsDialogOpen(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load style",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Initialize map when dialog opens and we have a currentStyle
  useEffect(() => {
    if (isDialogOpen && currentStyle) {
      const timeout = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
        if (mapContainerRef.current) {
          mapRef.current = new maplibregl.Map({
            container: mapContainerRef.current,
            style: currentStyle, // styleData returned from the API
            center: [0, 0],
            zoom: 1,
          });
        }
      }, 100); // 100ms delay

      return () => clearTimeout(timeout); 
    }
  }, [isDialogOpen, currentStyle, mapContainerRef]);

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
              {loading ? "Adding..." : "Add Style"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Existing Styles</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewStyle(style.name)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Style Preview: {currentStyle?.name || ""}</DialogTitle>
          </DialogHeader>
          <div className="h-[400px] w-full rounded-md border overflow-hidden">
            <div ref={mapContainerRef} className="h-full w-full" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
