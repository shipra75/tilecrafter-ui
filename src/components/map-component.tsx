import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from '../utils/api'
import { toast } from "@/components/ui/use-toast"

export function MapComponent() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [datasets, setDatasets] = useState([])
  const [selectedDataset, setSelectedDataset] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.olamaps.io/styles/default-light-standard/style.json', // Placeholder style
      center: [0, 0],
      zoom: 1
    })
  }, [])

  useEffect(() => {
    fetchDatasets()
  }, [])

  const fetchDatasets = async () => {
    try {
      setLoading(true)
      const data = await api.datasets.getAll("generated")
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

  const handleDatasetChange = async (value: string) => {
    const previosDataset = selectedDataset;
    try {
      setLoading(true)
      const tilesetData = await api.datasets.getTileset(value)
      setSelectedDataset(value)

      toast({
        title: "Success",
        description: "Dataset loaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dataset",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Select onValueChange={handleDatasetChange} value={selectedDataset}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a dataset" />
          </SelectTrigger>
          <SelectContent>
            {datasets.map((dataset) => (
              <SelectItem key={dataset.datasetName} value={dataset.datasetName}>
                {dataset.datasetName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={fetchDatasets} disabled={loading}>
          Refresh Datasets
        </Button>
      </div>
      <div ref={mapContainer} className="w-full h-[600px] rounded-lg overflow-hidden" />
    </div>
  )
}

