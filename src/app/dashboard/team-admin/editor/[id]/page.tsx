'use client'
import React, { useEffect } from "react";
import Content from "../../../../../components/articlecontentEditor/content";
import { useParams, useRouter } from "next/navigation";

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams(); // Access params as a Promise
  const articleId = params.id; // Access id directly from params

  useEffect(() => {
    if (isNaN(Number(articleId))) {
      router.push("/404");
    }
  }, [articleId, router]);

  return (
    <div>
      <Content id={articleId} />
    </div>
  );
}