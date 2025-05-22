export default ({ dataList, icon }: { dataList: string[] | null | undefined, icon: ReactNode}) => {
  if (dataList && dataList.length > 0) {
    return (
      <div className="flex items-center text-3xl lg:text-2xl lg:mr-5">
        {icon}
        {dataList.join(', ')}
      </div>
    );
  }

  return null;
}