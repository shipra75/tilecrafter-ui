import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { DatasetManager } from './dataset-manager'
import { StyleManager } from './style-manager'
import { SpriteManager } from './sprite-manager'
import { FontManager } from './font-manager'
import { MapComponent } from './map-component'

export default function TileCrafterUI() {
  const [activeTab, setActiveTab] = useState('map')

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold mb-6 text-primary">TileCrafter Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 h-14">
          <TabsTrigger value="map" className="text-lg">Map</TabsTrigger>
          <TabsTrigger value="datasets" className="text-lg">Datasets</TabsTrigger>
          <TabsTrigger value="styles" className="text-lg">Styles</TabsTrigger>
          <TabsTrigger value="sprites" className="text-lg">Sprites</TabsTrigger>
          <TabsTrigger value="fonts" className="text-lg">Fonts</TabsTrigger>
        </TabsList>
        <Card className="mt-6 border-none shadow-lg">
          <CardContent className="p-6">
            <TabsContent value="map"><MapComponent /></TabsContent>
            <TabsContent value="datasets"><DatasetManager /></TabsContent>
            <TabsContent value="styles"><StyleManager /></TabsContent>
            <TabsContent value="sprites"><SpriteManager /></TabsContent>
            <TabsContent value="fonts"><FontManager /></TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}

