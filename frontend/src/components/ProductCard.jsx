import React from 'react'

export default function ProductCard({product}) {
  return (
    <article className="border rounded p-3">
      <h3 className="font-semibold">{product?.name ?? 'Nombre'}</h3>
      <p className="text-sm">{product?.description ?? 'Descripción corta'}</p>
      <div className="mt-2">
        <span className="font-bold">${product?.price ?? '0.00'}</span>
      </div>
    </article>
  )
}
