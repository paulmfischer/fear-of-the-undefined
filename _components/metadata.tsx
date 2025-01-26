export default ({ dataList, icon }: { dataList: string[] | null | undefined, icon: ReactNode}) => {
  if (dataList && dataList.length > 0) {
    return (
      <div className="flex items-center lg:mr-5">
        <div className="w-6 h-6 lg:w-3 lg:h-3 mr-5">{icon}</div>
        {dataList.join(', ')}
      </div>
    );
  }

  return null;
}