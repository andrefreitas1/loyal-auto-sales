'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  status: string;
  images: Array<{
    id: string;
    url: string;
  }>;
  marketPrices: {
    retail: number;
  } | null;
  color: string;
  vin: string;
}

export default function VehiclesForSale() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      if (response.ok) {
        const data = await response.json();
        // Filtra apenas os veículos com status 'for_sale'
        const forSaleVehicles = data.filter((v: Vehicle) => v.status === 'for_sale');
        setVehicles(forSaleVehicles);
      }
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (vehicleId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [vehicleId]: true
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Veículos à Venda</h1>
            <p className="mt-2 text-gray-600">Confira nossa seleção de veículos disponíveis para venda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/protected/vehicles/${vehicle.id}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                <div className="relative aspect-[16/9]">
                  {vehicle.images?.length > 0 && !imageErrors[vehicle.id] ? (
                    <Image
                      src={vehicle.images[0].url}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(vehicle.id)}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {vehicle.brand} {vehicle.model} {vehicle.year}
                  </h2>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{vehicle.mileage.toLocaleString()} mi</span>
                    </div>

                    {vehicle.marketPrices && (
                      <div className="mt-6">
                        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-4 text-white">
                          <p className="text-sm text-primary-100">Valor de Venda</p>
                          <p className="text-2xl font-bold">${vehicle.marketPrices.retail.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {vehicles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum veículo disponível para venda no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 