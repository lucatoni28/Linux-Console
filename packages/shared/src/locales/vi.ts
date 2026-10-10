/**
 * 服务端越南语翻译资源
 *
 * 仅包含服务端 getMessage() 实际用到的 errors.* 键。
 * 前端翻译使用 react-i18next，参见 ../i18n/index.ts
 */
import type { TranslationSchema } from "./zh.js";

export const vi: TranslationSchema = {
  translation: {
    errors: {
      common: {
        unauthorized: "Chưa đăng nhập",
        forbidden: "Không có quyền truy cập",
        notFound: "Không tìm thấy tài nguyên",
        missingGame: "Thiếu tham số game",
        gameForbidden: "Không có quyền truy cập game này",
      },
      auth: {
        invalidCredentials: "Email hoặc mật khẩu không đúng",
        defaultGameNotFound: "Không tìm thấy game mặc định",
        emailAlreadyRegistered: "Email đã được đăng ký",
      },
      user: {
        notFound: "Không tìm thấy người dùng",
        emailInUse: "Email đã được sử dụng",
        wrongPassword: "Mật khẩu hiện tại không đúng",
      },
      game: {
        notFound: "Không tìm thấy game",
        onlyOwnerCanUpdate: "Chỉ chủ sở hữu mới được cập nhật",
        onlyOwnerCanDelete: "Chỉ chủ sở hữu mới được xoá",
        slugExists: "Slug đã tồn tại",
        onlyOwnerCanTransfer: "Chỉ chủ sở hữu mới được chuyển quyền sở hữu",
        newOwnerNotFound: "Không tìm thấy người dùng đích",
      },
      file: {
        notFound: "Không tìm thấy tệp hoặc thư mục",
        noAccess: "Không có quyền truy cập tệp trong game này",
        nameConflict: "Đã có tệp hoặc thư mục trùng tên",
        parentNotFound: "Không tìm thấy thư mục đích",
        parentNotFolder: "Đích không phải là thư mục",
        cannotMoveToDescendant: "Không thể chuyển thư mục vào thư mục con của chính nó",
        uploadNotComplete: "Tải tệp lên chưa hoàn tất",
        notAFile: "Mục này không phải là tệp",
      },
      magic: {
        notFound: "Không tìm thấy võ công",
        fileNameConflict: "Tên tệp võ công đã tồn tại",
        invalidIniFormat: "Định dạng tệp INI không hợp lệ",
      },
      scene: {
        notFound: "Không tìm thấy cảnh",
        itemNotFound: "Không tìm thấy mục trong cảnh",
        keyConflict: "Khoá cảnh đã tồn tại",
      },
      goods: {
        notFound: "Không tìm thấy vật phẩm",
      },
      npc: {
        notFound: "Không tìm thấy NPC",
      },
      obj: {
        notFound: "Không tìm thấy vật thể",
      },
    },
  },
};
