"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "../utils/api"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, Eye } from "lucide-react"

export function DatasetManager() {
  const [datasets, setDatasets] = useState<any[]>([])
  const [datasetName, setDatasetName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDatasets()
  }, [])

  const fetchDatasets = async () => {
    try {
      setLoading(true)
      const data = await api.datasets.getAll("")
      setDatasets(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch datasets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      setLoading(true)
      await api.datasets.upload(datasetName, file)
      toast({
        title: "Success",
        description: "Dataset uploaded successfully",
      })
      fetchDatasets()
      setDatasetName("")
      setFile(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload dataset",
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
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">Upload New Dataset</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="datasetName" className="text-gray-700 dark:text-gray-300 font-medium">Dataset Name</Label>
              <Input
                id="datasetName"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="Enter dataset name"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="file" className="text-gray-700 dark:text-gray-300 font-medium">Upload File</Label>
              <Input
                id="file"
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
                  <span>Upload Dataset</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">Existing Datasets</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="bg-white dark:bg-gray-950 rounded-md overflow-hidden">
            <TableHeader className="bg-gray-100 dark:bg-gray-900">
              <TableRow>
                <TableHead className="py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Dataset Name</TableHead>
                <TableHead className="py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Status</TableHead>
                <TableHead className="py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Feature Count</TableHead>
                <TableHead className="py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Feature Type</TableHead>
                <TableHead className="py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasets.map((dataset) => (
                <TableRow
                  key={dataset.datasetName}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <TableCell className="py-3 px-4 align-middle text-gray-800 dark:text-gray-200">{dataset.datasetName}</TableCell>
                  <TableCell className="py-3 px-4 align-middle">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-sm font-medium ${dataset.status === "Ready"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                    >
                      {dataset.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 align-middle text-gray-800 dark:text-gray-200">{dataset.featureCount}</TableCell>
                  <TableCell className="py-3 px-4 align-middle text-gray-800 dark:text-gray-200">{dataset.geometryType}</TableCell>
                  <TableCell className="py-3 px-4 align-middle">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => api.datasets.getOne(dataset.datasetName)}
                    >
                      <Eye className="h-4 w-4" />
                      View
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
