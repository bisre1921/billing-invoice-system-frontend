import React from 'react';

const PageHeader = ({ title }: { title: any }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-semibold text-neutral-800">{title}</h1>
      {/* You can add breadcrumbs or additional information here */}
    </div>
  );
};

export default PageHeader;