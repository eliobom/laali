import { Truck } from 'lucide-react';

export default function DeliveryInfo() {
  return (
    <section className="bg-gray-900 text-white py-16 px-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Truck size={40} className="text-yellow-400" />
          <h2 className="text-4xl font-bold">DESPACHO A DOMICILIO</h2>
        </div>

        <p className="text-center text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Comunas con despacho a domicilio: Las Condes, Vitacura, Lo Barnechea,
          Providencia, Ñuñoa, Macul, San Joaquín, La Florida, Recoleta, Independencia,
          Puente Alto, Santiago Centro y La Reina.
        </p>
      </div>
    </section>
  );
}
