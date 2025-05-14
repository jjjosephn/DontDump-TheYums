"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, MapPin, Navigation, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

// This would come from an environment variable
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "YOUR_MAPBOX_TOKEN"

// Type for food bank data
interface FoodBank {
  id: string
  name: string
  address: string
  coordinates: [number, number]
  distance?: number
  description?: string
  phone?: string
  services?: string[]
}

export default function ShelterMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [selectedFoodBank, setSelectedFoodBank] = useState<FoodBank | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [foodBanks, setFoodBanks] = useState<FoodBank[]>([])
  const [locationInput, setLocationInput] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-98.5795, 39.8283], // Default to center of US
      zoom: 3,
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  // Get user location
   const getUserLocation = async () => {
      setIsLoading(true);
      setError(null);
   
      try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
   
      if (permissionStatus.state === 'denied') {
         setError("Location permission was denied. Please allow location access in your browser settings.");
         setIsLoading(false);
         return;
      }
   
      navigator.geolocation.getCurrentPosition(
         (position) => {
            const { longitude, latitude } = position.coords;
            setUserLocation([longitude, latitude]);
   
            if (map.current) {
            map.current.flyTo({
               center: [longitude, latitude],
               zoom: 12,
               essential: true,
            });
            }
   
            fetchFoodBanks([longitude, latitude]);
         },
         () => {
            setError("Unable to get your location. Please enter your location manually.");
            setIsLoading(false);
         }
      );
      } catch (err) {
      setError("Your browser doesn't support the Permissions API or geolocation.");
      setIsLoading(false);
      }
   };
 
   console.log("User location:", userLocation)

  // Fetch food banks from Mapbox Search API
  const fetchFoodBanks = async (coordinates: [number, number]) => {
    try {
      setIsLoading(true)

      // Clear existing markers
      clearMarkers()

      // Add user marker
      if (map.current) {
        const userMarker = new mapboxgl.Marker({ color: "#FF0000" })
          .setLngLat(coordinates)
          .addTo(map.current)
          .setPopup(new mapboxgl.Popup().setHTML("<h3>Your Location</h3>"))

        markersRef.current.push(userMarker)
      }

      // Construct the API URL
      const url = `https://api.mapbox.com/search/searchbox/v1/forward?q=food%20bank&limit=10&proximity=${coordinates[0]},${coordinates[1]}&access_token=${MAPBOX_TOKEN}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch food banks")
      }

      const data = await response.json()

      // Process the response data
      const foodBankData: FoodBank[] = data.features.map((feature: any) => {
        const [lng, lat] = feature.geometry.coordinates
        
        // Convert distances from km to miles if they exist
        let distance = feature.properties.distance
        if (distance !== undefined) {
          distance = distance * 0.621371 // Convert km to miles
        }

        return {
          id: feature.properties.mapbox_id,
          name: feature.properties.name || feature.properties.place_name || "Food Bank",
          address: feature.properties.address || feature.properties.place_name,
          coordinates: [lng, lat],
          description: feature.properties.category || "Food Bank",
          distance: distance,
          services: ["Food Assistance"],
        }
      })

      setFoodBanks(foodBankData)
      addFoodBankMarkers(foodBankData)
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching food banks:", err)
      setError("Failed to fetch food banks. Please try again.")
      setIsLoading(false)
    }
  }

  // Add markers for food banks
  const addFoodBankMarkers = (banks: FoodBank[]) => {
    if (!map.current) return

    banks.forEach((bank) => {
      const el = document.createElement("div")
      el.className = "food-bank-marker"
      el.innerHTML =
        '<div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold">F</div>'

      // Create a popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h3 class="font-bold">${bank.name}</h3>
         <p>${bank.description || "Food Bank"}</p>`,
      )

      // Add marker to map
      const marker = new mapboxgl.Marker(el).setLngLat(bank.coordinates).setPopup(popup).addTo(map.current!)

      marker.getElement().addEventListener("click", () => {
        setSelectedFoodBank(bank)
      })

      markersRef.current.push(marker)
    })
  }

  // Clear all markers from the map
  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []
  }

  // Handle manual location search
  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!locationInput.trim()) {
      setError("Please enter a location")
      return
    }

    try {
      setIsSearching(true)
      setError(null)

      // Geocode the location input
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationInput)}.json?access_token=${MAPBOX_TOKEN}&limit=1`

      const response = await fetch(geocodeUrl)

      if (!response.ok) {
        throw new Error("Failed to geocode location")
      }

      const data = await response.json()

      if (data.features.length === 0) {
        throw new Error("Location not found")
      }

      const [lng, lat] = data.features[0].center
      setUserLocation([lng, lat])

      if (map.current) {
        map.current.flyTo({
          center: [lng, lat],
          zoom: 12,
          essential: true,
        })
      }

      // Fetch food banks near this location
      fetchFoodBanks([lng, lat])
    } catch (err) {
      console.error("Error searching location:", err)
      setError("Failed to find location. Please try a different search term.")
    } finally {
      setIsSearching(false)
    }
  }

  // Navigate to a food bank
  const navigateToFoodBank = (bank: FoodBank) => {
    if (!map.current) return

    map.current.flyTo({
      center: bank.coordinates,
      zoom: 15,
      essential: true,
    })

    setSelectedFoodBank(bank)
  }

  // Calculate distance between two points (in miles)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3956 // Radius of the earth in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Format distance
  const formatDistance = (distance?: number) => {
    if (!distance) return "Unknown distance"

    if (distance < 0.1) {
      // For very short distances, convert to feet (1 mile = 5280 feet)
      return `${Math.round(distance * 5280)} ft away`
    }

    return `${distance.toFixed(1)} mi away`
  }

  // Initialize by getting user location
  useEffect(() => {
    getUserLocation()
  }, [])

  console.log("Food banks:", foodBanks)
  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      <div className="p-4 overflow-auto md:col-span-1">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Nearby Food Banks</h2>
          <p className="text-sm text-muted-foreground mb-4">Find food banks near your location</p>

          <form onSubmit={handleLocationSearch} className="space-y-2 mb-4">
            <div className="grid gap-1.5">
              <Label htmlFor="location">Enter location manually</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="City, address, or zip code"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                />
                <Button type="submit" size="icon" disabled={isSearching}>
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </form>

          <Button variant="outline" className="w-full mb-4 bg-[var(--map-button-bg)]" onClick={getUserLocation} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting location...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Use my current location
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : foodBanks.length > 0 ? (
          <div className="space-y-4">
            {foodBanks.map((bank) => (
              <Card
                key={bank.id}
                className={`cursor-pointer transition-colors ${selectedFoodBank?.id === bank.id ? "border-primary" : ""}`}
                onClick={() => navigateToFoodBank(bank)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{bank.name}</CardTitle>
                  <CardDescription className="flex items-center text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    {bank.address}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Badge variant="outline" className="mb-2">
                    {bank.description || "Food Bank"}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                     {userLocation ? 
                        formatDistance(calculateDistance(bank.coordinates[0], bank.coordinates[1], userLocation[0], userLocation[1])) 
                        : "Distance unavailable"
                     }
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : userLocation ? (
          <div className="p-4 text-sm border rounded-md bg-muted">
            No food banks found in this area. Try a different location.
          </div>
        ) : null}
      </div>

      <div className="relative md:col-span-2 lg:col-span-3">
        <div ref={mapContainer} className="w-full h-full" />

        {selectedFoodBank && (
          <Card className="absolute bottom-4 left-4 right-4 max-w-md">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedFoodBank.name}</CardTitle>
                  <CardDescription>{selectedFoodBank.address}</CardDescription>
                </div>
                <Badge>{selectedFoodBank.description || "Food Bank"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">

              {selectedFoodBank.services && selectedFoodBank.services.length > 0 && (
                <div className="mb-4">
                  <div className="font-semibold">Services:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedFoodBank.services.map((service) => (
                      <Badge key={service} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-2">
                  <div className="font-semibold">Distance:</div>
                  <div>
                     {userLocation ? 
                        formatDistance(calculateDistance(selectedFoodBank.coordinates[0], selectedFoodBank.coordinates[1], userLocation[0], userLocation[1])) 
                        : "Distance unavailable"
                     }
                  </div>
               </div>

              <Separator className="my-4" />

              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => setSelectedFoodBank(null)}>
                  Close
                </Button>
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    // Open directions in Google Maps
                    const [lng, lat] = selectedFoodBank.coordinates
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank")
                  }}
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}