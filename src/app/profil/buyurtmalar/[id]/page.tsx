import React from 'react';
import OrderChatClient from './OrderChatClient';

export function generateStaticParams() {
  return [
    { id: 'ord_101' },
    { id: 'ord_102' },
    { id: 'demo' },
  ];
}

export default function OrderChatPage({ params }: { params: { id: string } }) {
  return <OrderChatClient orderId={params.id} />;
}
