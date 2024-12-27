// app/classification/[id]/page.tsx
'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react'
import Article from '../../components/articles/article';


export default function ClassificationPage() {
    const params = useParams(); // Access params as a Promise
    const articleId = params.id; // Access id directly from params

  return (
    <div>
      <Article categoryId={Number(articleId)} />
    </div>
  )
}
