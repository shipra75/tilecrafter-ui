'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from '../utils/api'
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SpriteManager() {
  const [folders, setFolders] = useState([])
  const [folderName, setFolderName] = useState('')
  const [iconName, setIconName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchFolders()
  }, [])

  const fetchFolders = async () => {
    try {
      setLoading(true)
      // Assuming there's an API endpoint to list folders
      const data = await api.sprites.listFolders()
      setFolders(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch folders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUploadIcon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      setLoading(true)
      await api.sprites.uploadIcon(iconName, folderName, file)
      toast({
        title: "Success",
        description: "Icon uploaded successfully",
      })
      setIconName('')
      setFile(null)
      fetchFolders()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload icon",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateSpritesheet = async (folder: string) => {
    try {
      setLoading(true)
      await api.sprites.generateSpritesheet(folder, folder, '@1x')
      toast({
        title: "Success",
        description: "Spritesheet generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate spritesheet",
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
          <CardTitle>Upload New Icon</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUploadIcon} className="space-y-4">
            <div>
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
            <div>
              <Label htmlFor="iconName">Icon Name</Label>
              <Input
                id="iconName"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                placeholder="Enter icon name"
              />
            </div>
            <div>
              <Label htmlFor="iconFile">Upload Icon</Label>
              <Input
                id="iconFile"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Icon'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sprite Folders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Folder Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {folders.map((folder) => (
                <TableRow key={folder}>
                  <TableCell>{folder}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleGenerateSpritesheet(folder)}
                      disabled={loading}
                    >
                      Generate Spritesheet
                    </Button>
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

