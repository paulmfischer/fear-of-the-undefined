export default (data: Lume.Data, helpers: Lume.Helpers) => {
  return (
    <div className="profile-wrapper flex flex-col gap-10 lg:gap-4">
      <div id="avatar" className="mt-12 size-44 lg:size-24">
        <a href="/">
          <img src="/assets/img/avatar-150x150.png" alt="avatar" className="size-44 lg:size-24 rounded-full border-2 border-slate-800 dark:border-slate-300" />
        </a>
      </div>
      <h2 className="lg:text-xl dark:text-slate-400" id="siteTitle">{data.siteTitle}</h2>
      <div className="text-3xl lg:text-base italic" id="siteDescription">{data.siteDescription}</div>
    </div>
  );
};