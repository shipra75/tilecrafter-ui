'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from '../utils/api'
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DatasetManager() {
  const [datasets, setDatasets] = useState([])
  const [datasetName, setDatasetName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDatasets()
  }, [])

  const fetchDatasets = async () => {
    try {
      setLoading(true)
      const data = await api.datasets.getAll('')
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
      setDatasetName('')
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
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Dataset</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label htmlFor="datasetName">Dataset Name</Label>
              <Input
                id="datasetName"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="Enter dataset name"
              />
            </div>
            <div>
              <Label htmlFor="file">Upload File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Dataset'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Existing Datasets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dataset Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Feature Count</TableHead>
                <TableHead>Feature Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasets.map((dataset) => (
                
                <TableRow key={dataset.datasetName}>
                  <TableCell>{dataset.datasetName}</TableCell>
                  <TableCell>{dataset.status}</TableCell>
                  <TableCell>{dataset.featureCount}</TableCell>
                  <TableCell>{dataset.geometryType}</TableCell>

                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => api.datasets.getOne(dataset.datasetName)}>View</Button>
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

