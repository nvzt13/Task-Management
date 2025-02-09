import { GroupHeaderProps } from "@/type/types";
import { GroupSettings } from "./GroupSettings";

const GroupHeader: React.FC<GroupHeaderProps> = ({ group, isAdmin }) => {
  return (
    <header className="flex items-center justify-between border-b p-4 mb-4 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 shadow-md rounded-md transition-colors duration-300">
      {/* Grup Adı ve Açıklaması */}
      <div className="flex flex-col gap-2 md:gap-3 p-4 md:p-0">
        <p className="font-semibold text-xl md:text-2xl text-gray-900 transition-colors duration-300">
          {group.groupName}
        </p>
        <p className="text-sm text-gray-700">{group.description}</p>
      </div>

      {/* Grup Ayarları ve Bilgileri */}
      <div className="flex items-center justify-center mt-4 md:mt-0 p-2 md:p-4">
        {isAdmin && (
          <GroupSettings groupId={group.id} adminId={group.adminId} />
        )}
      </div>
    </header>
  );
};

export default GroupHeader;
