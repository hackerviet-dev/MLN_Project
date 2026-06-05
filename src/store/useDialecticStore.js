import { create } from 'zustand'

/**
 * Zustand Store — Mối quan hệ biện chứng:
 *   "Tồn tại xã hội quyết định Ý thức xã hội"
 *
 * technologyLevel (0-100): Trình độ công cụ sản xuất / lực lượng sản xuất
 * laborLevel      (0-100): Mức độ phát triển phương thức lao động
 *
 * Store CHỈ giữ raw state + actions.
 * Derived values được tính bằng pure functions + useMemo trong component
 * để tránh infinite loop (getSnapshot must be cached).
 */

// ── Hệ số ảnh hưởng của từng thanh trượt lên era tổng hợp ──────────
const TECH_WEIGHT = 0.6
const LABOR_WEIGHT = 0.4

// ── Dữ liệu từng thời kỳ ────────────────────────────────────────────
export const ERA_DATA = [
  {
    id: 'agriculture',
    label: 'Nông nghiệp',
    range: '0 – 32',
    color: '#d8ff87',
    glow: 'rgba(216, 255, 135, 0.16)',
    material:
      'Công cụ thô sơ, ruộng đất, lao động thủ công và cộng đồng làng xã.',
    title: 'Ý thức cộng đồng truyền thống',
    summary:
      'Đời sống vật chất ổn định quanh đất đai làm nổi bật tâm lý an phận, lễ giáo và lệ làng.',

    psychology: {
      label: 'Tâm lý xã hội',
      text: 'An phận thủ thường, tâm lý cộng đồng gắn với mùa vụ và lễ hội truyền thống. Cá nhân hoà tan trong tập thể làng xã.',
      intensity: 25,
    },
    morality: {
      label: 'Đạo đức',
      text: 'Trọng lễ giáo, tôn ti trật tự, hiếu thảo và nghĩa cộng đồng. Chuẩn mực đạo đức truyền miệng qua các thế hệ.',
      intensity: 20,
    },
    law: {
      label: 'Pháp quyền',
      text: 'Lệ làng, tục lệ địa phương đan xen với luật quốc gia. "Phép vua thua lệ làng" thể hiện tính phân tán của pháp quyền.',
      intensity: 15,
    },

    signals: [
      'Quan hệ xã hội gắn với huyết tộc, làng xã và mùa vụ.',
      'Đạo đức đề cao trật tự, bổn phận và tính cộng đồng.',
      'Pháp quyền còn hòa lẫn với tập tục địa phương.',
    ],
  },
  {
    id: 'industry',
    label: 'Công nghiệp',
    range: '33 – 66',
    color: '#36d7d0',
    glow: 'rgba(54, 215, 208, 0.18)',
    material: 'Máy móc, nhà máy, đô thị hóa và lao động tiền lương.',
    title: 'Ý thức kỷ luật và pháp quyền hiện đại',
    summary:
      'Sản xuất công nghiệp kéo con người vào nhịp độ máy móc, hợp đồng và tổ chức tập trung.',

    psychology: {
      label: 'Tâm lý xã hội',
      text: 'Tác phong công nghiệp: đúng giờ, kỷ luật, chuyên môn hóa. Tâm lý cạnh tranh và tinh thần cá nhân bắt đầu nổi lên.',
      intensity: 55,
    },
    morality: {
      label: 'Đạo đức',
      text: 'Đạo đức nghề nghiệp, trách nhiệm hợp đồng và quyền công dân. Giá trị "tự do cá nhân" dần được đề cao bên cạnh nghĩa vụ tập thể.',
      intensity: 50,
    },
    law: {
      label: 'Pháp quyền',
      text: 'Luật lao động, hợp đồng, hiến pháp rõ ràng. Nhà nước pháp quyền hình thành với hệ thống tư pháp độc lập hơn.',
      intensity: 60,
    },

    signals: [
      'Tác phong đúng giờ, năng suất và chuyên môn hóa trở thành chuẩn mực.',
      'Pháp luật lao động, hợp đồng và quyền công dân rõ nét hơn.',
      'Ý thức cá nhân bắt đầu tách khỏi cộng đồng làng xã khép kín.',
    ],
  },
  {
    id: 'digital',
    label: 'Số & AI',
    range: '67 – 100',
    color: '#f45ab8',
    glow: 'rgba(244, 90, 184, 0.2)',
    material:
      'Internet, dữ liệu lớn, nền tảng số, thuật toán và trí tuệ nhân tạo.',
    title: 'Ý thức số chủ động',
    summary:
      'Khi vật chất chuyển sang hạ tầng dữ liệu, ý thức xã hội dịch sang linh hoạt, cá nhân hóa và trách nhiệm số.',

    psychology: {
      label: 'Tâm lý xã hội',
      text: 'Linh hoạt, cá nhân hóa, FOMO và "burnout" kỹ thuật số. Tâm lý đa dạng phân mảnh theo các hệ sinh thái mạng xã hội.',
      intensity: 85,
    },
    morality: {
      label: 'Đạo đức',
      text: 'Đạo đức mạng, quyền riêng tư dữ liệu, minh bạch thuật toán. Ranh giới thiện – ác mờ nhòe trong không gian ảo.',
      intensity: 80,
    },
    law: {
      label: 'Pháp quyền',
      text: 'Luật an ninh mạng, bảo vệ dữ liệu cá nhân, quy chế nền tảng số. Pháp quyền chạy đua với tốc độ đổi mới công nghệ.',
      intensity: 90,
    },

    signals: [
      'Lao động gig, remote và freelancer làm thay đổi quan niệm về ổn định.',
      'Đạo đức mạng, quyền riêng tư và minh bạch dữ liệu trở thành vấn đề trung tâm.',
      'Pháp quyền số và an ninh mạng phản ánh một nền sản xuất mới dựa trên dữ liệu.',
    ],
  },
]

// ══════════════════════════════════════════════════════════════════════
// PURE HELPER FUNCTIONS (dùng với useMemo trong component)
// ══════════════════════════════════════════════════════════════════════

/** Giá trị composite = bình quân có trọng số */
export function computeComposite(technologyLevel, laborLevel) {
  return Math.round(technologyLevel * TECH_WEIGHT + laborLevel * LABOR_WEIGHT)
}

/** Xác định era index (0, 1, 2) từ composite */
export function resolveEraIndex(compositeValue) {
  if (compositeValue < 33) return 0
  if (compositeValue < 67) return 1
  return 2
}

/** Nội suy intensity: dao động ±15 quanh base theo composite */
export function interpolateIntensity(baseIntensity, compositeValue) {
  const deviation = ((compositeValue - 50) / 50) * 15
  return Math.round(Math.min(100, Math.max(0, baseIntensity + deviation)))
}

// ══════════════════════════════════════════════════════════════════════
// STORE — chỉ giữ raw state + actions, KHÔNG getter
// ══════════════════════════════════════════════════════════════════════

const useDialecticStore = create((set) => ({
  // ── Tồn tại xã hội (2 thanh trượt) ──────────────────────────────
  technologyLevel: 72, // Trình độ LLSX / công cụ sản xuất
  laborLevel: 68, // Phương thức lao động

  // ── Actions ──────────────────────────────────────────────────────
  setTechnologyLevel: (value) =>
    set({ technologyLevel: Math.min(100, Math.max(0, value)) }),

  setLaborLevel: (value) =>
    set({ laborLevel: Math.min(100, Math.max(0, value)) }),

  // Đặt cả hai cùng lúc (dùng khi click nhanh vào icon era)
  setEraPreset: (eraIndex) => {
    const presets = [
      { technologyLevel: 16, laborLevel: 16 },
      { technologyLevel: 50, laborLevel: 50 },
      { technologyLevel: 84, laborLevel: 84 },
    ]
    set(presets[eraIndex] ?? presets[2])
  },

  // Giữ lại compat cũ: single slider → set cả 2
  setEraValue: (value) => {
    const clamped = Math.min(100, Math.max(0, value))
    set({ technologyLevel: clamped, laborLevel: clamped })
  },
}))

export default useDialecticStore
