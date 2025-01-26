import { FontAwesomeIcon } from 'npm:@fortawesome/react-fontawesome';
import { faTag, faList, faCalendar } from 'npm:@fortawesome/free-solid-svg-icons';

export default ({ search, comp }: Lume.Data, helpers: Lume.Helpers) => {
  const posts = search.pages('post').sort((post1, post2) => post2.date.getTime() - post1.date.getTime());
  return (
    <ul className="pl-0 mr-12">
      {posts.map((post) => (
        <li key={post.title} className="list-none pb-5 mb-8 lg:mb-5 border-b border-solid border-slate-700" data-pagefind-ignore>
          <a className="py-5 text-blue-600 dark:text-blue-400 lg:text-lg" href={post.url}>{post.title}</a> <span className="hidden lg:inline ml-3 text-sm">{post.readingInfo.minutes} min read</span>
          <div className="lg:hidden mt-3 text-sm">{post.readingInfo.minutes} min read</div>
          {post.description && <div className="my-6 text-3xl lg:my-2 lg:text-sm italic">{post.description}</div>}
          <div className="flex flex-col gap-3 text-2xl lg:flex-row italic lg:text-sm mt-3">
            <div className="flex items-center mr-5">
              <div className="w-6 h-6 lg:w-3 lg:h-3 mr-5">
                <FontAwesomeIcon icon={faCalendar} />
              </div>
              {helpers.date(post.date, 'MM/dd/yyyy')}
            </div>
            <comp.metadata dataList={post.categories} icon={<FontAwesomeIcon icon={faList} />} />
            <comp.metadata dataList={post.tags.filter(tag => tag != 'post')} icon={<FontAwesomeIcon icon={faTag} />} />
          </div>
        </li>
      ))}
    </ul>
  );
};