export default (data: Lume.Data, helpers: Lume.Helpers) => {
  return (
    <div className="profile-wrapper">
      <div id="avatar" className="mt-12 mb-8">
        <a href="/">
          <img src="/assets/img/avatar-150x150.png" alt="avatar" className="size-44 lg:size-24 rounded-full border-2 border-slate-800 dark:border-slate-300" />
        </a>
      </div>
      <h2 className="text-4xl lg:text-xl mb-5 dark:text-slate-400" id="siteTitle">{data.siteTitle}</h2>
      <div className="text-2xl lg:text-base italic mb-12" id="siteDescription">{data.siteDescription}</div>
    </div>
  );
};