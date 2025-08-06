import React from 'react';

const DirectoryItemPage = ({ params }: { params: { slug: string } }) => {
  return <div>{params.slug}</div>;
};

export default DirectoryItemPage;
