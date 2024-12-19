"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "../utils/api"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, RefreshCw } from "lucide-react"

export function SpriteManager() {
  const [folders, setFolders] = useState<string[]>([])
  const [folderName, setFolderName] = useState("")
  const [iconName, setIconName] = useState("")
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
      setIconName("")
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
      await api.sprites.generateSpritesheet(folder, folder, "@1x")
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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black p-6 space-y-8">
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">Upload New Icon</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUploadIcon} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="folderName" className="text-gray-700 dark:text-gray-300 font-medium">Folder Name</Label>
              <Input
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="iconName" className="text-gray-700 dark:text-gray-300 font-medium">Icon Name</Label>
              <Input
                id="iconName"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                placeholder="Enter icon name"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="iconFile" className="text-gray-700 dark:text-gray-300 font-medium">Upload Icon</Label>
              <Input
                id="iconFile"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button type="submit" disabled={loading} className="flex items-center gap-2">
              {loading ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload Icon</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">Sprite Folders</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="bg-white dark:bg-gray-950 rounded-md overflow-hidden">
            <TableHeader className="bg-gray-100 dark:bg-gray-900">
              <TableRow>
                <TableHead className="py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Folder Name</TableHead>
                <TableHead className="py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {folders.map((folder) => (
                <TableRow
                  key={folder}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <TableCell className="py-3 px-4 align-middle text-gray-800 dark:text-gray-200">{folder}</TableCell>
                  <TableCell className="py-3 px-4 align-middle">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleGenerateSpritesheet(folder)}
                      disabled={loading}
                    >
                      <RefreshCw className="h-4 w-4" />
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
