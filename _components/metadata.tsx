export default ({ dataList, icon, className }: { dataList: string[] | null | undefined, icon: ReactNode, className: string }) => {
  if (dataList && dataList.length > 0) {
    return (
      <div className={`flex items-center lg:mr-5 ${className}`}>
        {icon}
        {dataList.join(', ')}
      </div>
    );
  }

  return null;
}