import { useEffect, useState } from "react";
import {
  Users,
  UserX,
  BookOpen,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  Newspaper,
} from "lucide-react";
import { getDataDashboard } from "@api/dashboard";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUserLoading } from "@redux/loadingSlice";
import Loading from "@components-ui/Loading";
import Title from "@components-ui/Title";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const isLoading = useSelector((state) => state.loading.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        dispatch(setUserLoading(true));
        const res = await getDataDashboard();
        if (res.success) {
          setData(res);
        } else {
          toast.error("Lấy dữ liệu thất bại");
        }
      } catch (err) {
        console.log("Lỗi lấy dữ liệu: ", err);
        toast.error(err?.response?.data?.message || "Lỗi khi lấy dữ liệu");
      } finally {
        dispatch(setUserLoading(false));
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading || !data) return <Loading />;

  const { accounts, posts, reports, blogs } = data;

  const cards = [
    {
      title: "Người dùng hoạt động",
      value: accounts.activeUsers,
      icon: <Users className="text-green-500" />,
      bg: "bg-green-50",
    },
    {
      title: "Người dùng bị khóa",
      value: accounts.blockedUsers,
      icon: <UserX className="text-red-500" />,
      bg: "bg-red-50",
    },
    {
      title: "Giáo viên hoạt động",
      value: accounts.activeTeachers,
      icon: <BookOpen className="text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      title: "Giáo viên bị khóa",
      value: accounts.blockedTeachers,
      icon: <UserX className="text-orange-500" />,
      bg: "bg-orange-50",
    },
    {
      title: "Bài đăng chờ duyệt",
      value: posts.pending,
      icon: <AlertTriangle className="text-yellow-500" />,
      bg: "bg-yellow-50",
    },
    {
      title: "Bài đăng đã duyệt",
      value: posts.approved,
      icon: <FileCheck className="text-emerald-500" />,
      bg: "bg-emerald-50",
    },
    {
      title: "Báo cáo chờ xử lý",
      value: reports.pending,
      icon: <AlertTriangle className="text-red-400" />,
      bg: "bg-red-50",
    },
    {
      title: "Báo cáo đã giải quyết",
      value: reports.resolved,
      icon: <CheckCircle className="text-green-400" />,
      bg: "bg-green-50",
    },
    {
      title: "Tổng số blog",
      value: blogs.total,
      icon: <Newspaper className="text-indigo-500" />,
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="p-6">
      <Title text="Dashboad" size="2xl" className="mb-4 font-semibold" />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((item, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-lg shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${item.bg}`}
          >
            <div>
              <p className="text-gray-600 text-sm">{item.title}</p>
              <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
            </div>
            <div className="text-3xl">{item.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
