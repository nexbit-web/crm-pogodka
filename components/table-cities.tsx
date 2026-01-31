"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "./ui/spinner";
import { Input } from "@/components/ui/input";
import AddCityDialog from "./AddCityDialog";
import CityActions from "./CityActions";
import { toast } from "react-hot-toast";

type City = {
  id: number;
  nameUa: string;
  nameRu: string;
  nameEn: string;
  region: string;
  countryUa: string;
  countryEn: string;
  latitude: number;
  longitude: number;
  slug: string;
};

export default function TableCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchCities() {
      const res = await fetch("/api/cities");
      const data: City[] = await res.json();
      setCities(data);
      setLoading(false);
    }
    fetchCities();
  }, []);

  const filteredCities = cities.filter(
    (city) =>
      city.nameUa.toLowerCase().includes(search.toLowerCase()) ||
      city.region.toLowerCase().includes(search.toLowerCase()) ||
      city.countryUa.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Spinner className="h-6 w-6" />
      </div>
    );

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/cities/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Помилка при видаленні міста");
    }

    setCities((prev) => prev.filter((city) => city.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Міста {cities.length}</h1>

      <div className="flex justify-between   mb-2 gap-2.5">
        <Input
          placeholder="Пошук..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 max-w-sm "
        />
        <AddCityDialog onCityAdded={(city) => setCities([...cities, city])} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Назва (UA)</TableHead>
            <TableHead>Регіон</TableHead>
            <TableHead>Країна (UA)</TableHead>
            <TableHead>Широта</TableHead>
            <TableHead>Довгота</TableHead>
            <TableHead>Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCities.map((city, index) => (
            <TableRow key={city.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{city.nameUa}</TableCell>
              <TableCell>{city.region}</TableCell>
              <TableCell>{city.countryUa}</TableCell>
              <TableCell>{city.latitude}</TableCell>
              <TableCell>{city.longitude}</TableCell>
              <TableCell>
                <CityActions
                  cityId={city.id}
                  onDelete={handleDelete}
                  onEdit={(id) => toast.success(`Редагувати місто ${id}`)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
