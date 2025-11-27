
import MainLayout from '@/components/organisms/MainLayout'; 
import Feed from '@/components/organisms/Feed'; 
import NewPostForm from '@/components/organisms/NewPostForm';

export default function HomePage() {
  return (
  <MainLayout>
    <div className="p-4 sticky top-0 bg-[#020618] z-10">
  <div className="border-b border-gray-800 w-[95%] pb-2">
    <h1 className="text-xl font-bold">Discover</h1>
  </div>
</div>

      <NewPostForm />
      <Feed /> 
      </MainLayout>
      );
}