"use client"

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog"
import { Card, CardContent } from "../../../components/ui/card"
import { MapPin, Globe, Clock, Power, Phone, Sun, Currency, Languages } from "lucide-react"

interface CountryInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: string;
  city: string;
}

interface CountryDetails {
  capital: string;
  languages: string[];
  currency: {
    name: string;
    code: string;
    symbol: string;
  };
  electricity: {
    voltage: string;
    frequency: string;
    plugTypes: string[];
  };
  timeZone: string;
  phoneCode: string;
  bestTimeToVisit: string;
}
const countryData: Record<string, CountryDetails> = {
  "Egypt": {
    capital: "Cairo",
    languages: ["Arabic"],
    currency: {
      name: "Egyptian Pound",
      code: "EGP",
      symbol: "£"
    },
    electricity: {
      voltage: "220V",
      frequency: "50Hz",
      plugTypes: ["C", "F"]
    },
    timeZone: "UTC+2",
    phoneCode: "+20",
    bestTimeToVisit: "October to April"
  },
  "Switzerland": {
    capital: "Bern",
    languages: ["German", "French", "Italian", "Romansh"],
    currency: {
      name: "Swiss Franc",
      code: "CHF",
      symbol: "CHF"
    },
    electricity: {
      voltage: "230V",
      frequency: "50Hz",
      plugTypes: ["C", "J"]
    },
    timeZone: "UTC+1",
    phoneCode: "+41",
    bestTimeToVisit: "June to September"
  },

  "Turkey": {
    capital: "Ankara",
    languages: ["Turkish"],
    currency: {
      name: "Turkish Lira",
      code: "TRY",
      symbol: "₺"
    },
    electricity: {
      voltage: "230V",
      frequency: "50Hz",
      plugTypes: ["C", "F"]
    },
    timeZone: "UTC+3",
    phoneCode: "+90",
    bestTimeToVisit: "April to May and September to October"
  },

  "Greece": {
    capital: "Athens",
    languages: ["Greek"],
    currency: {
      name: "Euro",
      code: "EUR",
      symbol: "€"
    },
    electricity: {
      voltage: "230V",
      frequency: "50Hz",
      plugTypes: ["C", "F"]
    },
    timeZone: "UTC+2",
    phoneCode: "+30",
    bestTimeToVisit: "April to June and September to October"
  }
  // Add more countries as needed
};
const CountryInfoModal: React.FC<CountryInfoModalProps> = ({ isOpen, onClose, country, city }) => {
  const countryInfo = countryData[country] || null;
  if (!countryInfo) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-white p-0 mt-10">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2 text-slate-800">
            <Globe className="h-6 w-6 text-primary" />
            {country} Travel Information
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-8">
          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2 text-slate-800">
              <MapPin className="h-5 w-5 text-primary" />
              Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-50/50 hover:bg-slate-50/70 transition-colors">
                <CardContent className="p-5 text-center">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">Capital City</p>
                    <p className="text-base font-semibold text-slate-800">{countryInfo.capital}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-50/50 hover:bg-slate-50/70 transition-colors">
                <CardContent className="p-5 text-center">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">Languages</p>
                    <p className="text-base font-semibold text-slate-800">{countryInfo.languages.join(", ")}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-50/50 hover:bg-slate-50/70 transition-colors">
                <CardContent className="p-5 text-center">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">Time Zone</p>
                    <p className="text-base font-semibold text-slate-800">{countryInfo.timeZone}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Travel Essentials */}
          <div>
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2 text-slate-800">
              <Sun className="h-5 w-5 text-primary" />
              Travel Essentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-50/50 hover:bg-slate-50/70 transition-colors">
                <CardContent className="p-5 text-center">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">Currency</p>
                    <p className="text-base font-semibold text-slate-800">
                      {countryInfo.currency.name}
                    </p>
                    <p className="text-sm text-slate-600">
                      {countryInfo.currency.code} • {countryInfo.currency.symbol}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-50/50 hover:bg-slate-50/70 transition-colors">
                <CardContent className="p-5 text-center">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">Country Code</p>
                    <p className="text-base font-semibold text-slate-800">{countryInfo.phoneCode}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-50/50 hover:bg-slate-50/70 transition-colors">
                <CardContent className="p-5 text-center">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">Best Time to Visit</p>
                    <p className="text-base font-semibold text-slate-800">{countryInfo.bestTimeToVisit}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Electricity Information */}
          <div>
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2 text-slate-800">
              <Power className="h-5 w-5 text-primary" />
              Electricity Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-50/50 hover:bg-slate-50/70 transition-colors">
                <CardContent className="p-5 text-center">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">Voltage</p>
                    <p className="text-base font-semibold text-slate-800">{countryInfo.electricity.voltage}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-50/50 hover:bg-slate-50/70 transition-colors">
                <CardContent className="p-5 text-center">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">Frequency</p>
                    <p className="text-base font-semibold text-slate-800">{countryInfo.electricity.frequency}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-50/50 hover:bg-slate-50/70 transition-colors">
                <CardContent className="p-5 text-center">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">Plug Types</p>
                    <p className="text-base font-semibold text-slate-800">
                      Type {countryInfo.electricity.plugTypes.join(", Type ")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6 bg-amber-50 border border-amber-100 p-5 rounded-lg">
              <p className="text-sm text-amber-800 text-center">
                <strong>Travel Tip:</strong> Make sure to bring the appropriate power adapters for your devices.
                Check if you need a voltage converter for any of your electronics that don't support {countryInfo.electricity.voltage}.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CountryInfoModal;