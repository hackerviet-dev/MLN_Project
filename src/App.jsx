import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useDialecticStore, {
  ERA_DATA,
  computeComposite,
  resolveEraIndex,
  interpolateIntensity,
} from './store/useDialecticStore'
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Bot,
  Check,
  Factory,
  FileQuestion,
  Gavel,
  Globe2,
  Heart,
  Images,
  Palette,
  PanelTop,
  ShieldCheck,
  SlidersHorizontal,
  Brain,
  Scale,
  Sparkles,
  Users,
  Wheat,
  Workflow,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import './App.css'

const navItems = [
  { label: 'Lý luận', href: '#ly-luan' },
  { label: 'Kỷ nguyên số', href: '#ky-nguyen-so' },
  { label: 'Explorer', href: '#explorer' },
  { label: 'Slide gốc', href: '#slide-goc' },
]

const socialExistence = [
  {
    title: 'Phương thức sản xuất',
    text: 'Yếu tố cơ bản và quyết định nhất, gồm lực lượng sản xuất và quan hệ sản xuất, định hình toàn bộ đời sống vật chất.',
    icon: Factory,
  },
  {
    title: 'Điều kiện tự nhiên & Nhân khẩu',
    text: 'Môi trường địa lý và dân cư là tiền đề tất yếu, ảnh hưởng đến tốc độ và khả năng phát triển của mỗi cộng đồng xã hội.',
    icon: Globe2,
  },
]

const consciousnessForms = [
  {
    title: 'Pháp quyền',
    text: 'Hệ thống luật pháp phản ánh quan hệ kinh tế và bảo vệ lợi ích giai cấp thống trị.',
    icon: Gavel,
  },
  {
    title: 'Đạo đức',
    text: 'Các quy tắc ứng xử, quan niệm thiện - ác hình thành từ đời sống vật chất.',
    icon: Heart,
  },
  {
    title: 'Thẩm mỹ',
    text: 'Nhận thức về cái đẹp, nghệ thuật chịu sự quy định của trình độ phát triển xã hội.',
    icon: Palette,
  },
]

const transitionRows = [
  {
    criterion: 'Công cụ sản xuất',
    old: 'Con người, gia súc, công cụ thô sơ',
    now: 'Internet, dữ liệu lớn, trí tuệ nhân tạo',
  },
  {
    criterion: 'Phương thức lao động',
    old: 'Cố định tại làng xã, cánh đồng',
    now: 'Linh hoạt, remote, gig economy',
  },
  {
    criterion: 'Ý thức xã hội',
    old: 'An phận, trọng lễ giáo, lệ làng',
    now: 'Năng động, cá nhân hóa, luật an ninh mạng',
  },
]

const aiIntegrity = [
  {
    title: 'Công cụ sử dụng',
    text: 'Gemini 1.5 Pro hỗ trợ cấu trúc logic, gợi ý code và tra cứu số liệu kinh tế.',
    icon: Bot,
  },
  {
    title: 'Kiểm chứng',
    text: 'Đối chiếu với Giáo trình Triết học Mác-Lênin và báo cáo Google/Temasek 2024.',
    icon: ShieldCheck,
  },
  {
    title: 'Cam kết',
    text: 'Nhóm sinh viên trực tiếp biên tập, phản biện nội dung và thiết kế giao diện sản phẩm cuối cùng.',
    icon: Users,
  },
  {
    title: 'Nguồn tham khảo',
    text: 'Marxists.org, English Reference và tài liệu giảng dạy ITU.',
    icon: Workflow,
  },
]

// eraSteps giờ lấy từ store (ERA_DATA), chỉ thêm icon mapping
const ERA_ICONS = [Wheat, Factory, Bot]
const eraSteps = ERA_DATA.map((era, i) => ({ ...era, icon: ERA_ICONS[i] }))

const slides = [
  'Trang bìa',
  'Cơ sở lý luận Mác-Lênin',
  'Cấu trúc tồn tại xã hội',
  'Hình thái ý thức xã hội',
  'Nguyên lý quyết định',
  'Thực tiễn kỷ nguyên số',
  'Sự chuyển dịch đời sống vật chất',
  'Dẫn chứng tại Việt Nam',
  'Tăng trưởng kinh tế số',
  'Sản phẩm Web Explorer',
  'Minh bạch AI & Liêm chính',
  'Thảo luận & Phản biện',
  'Image Sources',
].map((title, index) => ({
  title,
  image: `/slide-assets/page-${String(index + 1).padStart(2, '0')}-image-01.jpg`,
}))

const chartPoints = [
  { label: '2022', value: 18 },
  { label: '2023', value: 30 },
  { label: '2024', value: 36 },
  { label: '2025', value: 45 },
]

function App() {
  // ── Zustand: chỉ select primitives ─────────────────────────────
  const technologyLevel = useDialecticStore((s) => s.technologyLevel)
  const laborLevel = useDialecticStore((s) => s.laborLevel)
  const setTechnologyLevel = useDialecticStore((s) => s.setTechnologyLevel)
  const setLaborLevel = useDialecticStore((s) => s.setLaborLevel)
  const setEraPreset = useDialecticStore((s) => s.setEraPreset)

  // ── Derived values via useMemo (tránh infinite loop) ───────────
  const compositeValue = useMemo(
    () => computeComposite(technologyLevel, laborLevel),
    [technologyLevel, laborLevel]
  )
  const eraIndex = useMemo(() => resolveEraIndex(compositeValue), [compositeValue])
  const activeEra = eraSteps[eraIndex]

  // 3 hình thái ý thức — computed, stable reference qua useMemo
  const psychology = useMemo(() => ({
    ...activeEra.psychology,
    intensity: interpolateIntensity(activeEra.psychology.intensity, compositeValue),
  }), [activeEra, compositeValue])

  const morality = useMemo(() => ({
    ...activeEra.morality,
    intensity: interpolateIntensity(activeEra.morality.intensity, compositeValue),
  }), [activeEra, compositeValue])

  const law = useMemo(() => ({
    ...activeEra.law,
    intensity: interpolateIntensity(activeEra.law.intensity, compositeValue),
  }), [activeEra, compositeValue])

  return (
    <motion.main
      className="site-shell"
      animate={{ '--era-accent': activeEra.color, '--era-glow': activeEra.glow }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <header className="top-nav">
        <a className="brand-mark" href="#top" aria-label="Đời sống quyết định ý thức">
          <Sparkles aria-hidden="true" />
          <span>MLN 3.4</span>
        </a>
        <nav aria-label="Điều hướng nội dung">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Assignment Chương 3.4: Ý thức xã hội</p>
          <h1>
            Đời sống <span>quyết định</span> ý thức
          </h1>
          <p className="hero-lede">
            Phân tích luận điểm của Karl Marx trong kỷ nguyên số 4.0, nơi dữ liệu,
            nền tảng và AI đang tái cấu trúc đời sống vật chất lẫn hình thái ý thức xã hội.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#explorer">
              <SlidersHorizontal aria-hidden="true" />
              Material Footprint Explorer
            </a>
            <a className="ghost-link" href="#slide-goc">
              <Images aria-hidden="true" />
              Xem slide gốc
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-label="Ảnh minh họa kỷ nguyên số từ slide">
          <img src="/slide-assets/digital-tunnel-hero.jpg" alt="" />
          <div className="hero-stat">
            <span>Tồn tại xã hội</span>
            <strong>đổi thay</strong>
          </div>
        </div>
      </section>

      <section className="section-band intro-band" id="ly-luan">
        <div className="section-heading">
          <p className="eyebrow">I. Cơ sở lý luận Mác-Lênin</p>
          <h2>Cấu trúc nền tảng của lập luận</h2>
          <p>
            Tồn tại xã hội là đời sống vật chất của xã hội. Ý thức xã hội là đời sống tinh thần
            phản ánh các điều kiện vật chất ấy qua pháp quyền, đạo đức, thẩm mỹ và nhiều hình thái khác.
          </p>
        </div>

        <div className="two-column-grid">
          {socialExistence.map((item) => (
            <article className="content-card" key={item.title}>
              <item.icon aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <div className="principle-panel">
          <div>
            <p className="eyebrow">Nguyên lý quyết định</p>
            <blockquote>
              “Không phải ý thức quyết định đời sống mà chính đời sống quyết định ý thức”
            </blockquote>
            <p>
              Khi tồn tại xã hội biến đổi, đặc biệt là phương thức sản xuất thay đổi,
              thì sớm hay muộn các quan niệm, tư tưởng cũng sẽ thay đổi theo.
            </p>
          </div>
          <div className="flow-lines" aria-hidden="true">
            <span>Đời sống vật chất</span>
            <ArrowUpRight />
            <span>Quan niệm xã hội</span>
          </div>
        </div>

        <div className="three-column-grid">
          {consciousnessForms.map((item) => (
            <article className="content-card compact-card" key={item.title}>
              <item.icon aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band" id="ky-nguyen-so">
        <div className="section-heading">
          <p className="eyebrow">II. Thực tiễn kỷ nguyên số</p>
          <h2>Sự chuyển dịch đời sống vật chất</h2>
          <p>
            Từ công cụ sản xuất đến phương thức lao động, nền kinh tế số làm thay đổi
            cách con người tổ chức việc làm, giao tiếp, pháp luật và chuẩn mực đạo đức.
          </p>
        </div>

        <div className="comparison-table" role="table" aria-label="So sánh xã hội nông nghiệp và kinh tế số">
          <div className="table-row table-head" role="row">
            <span role="columnheader">Tiêu chí</span>
            <span role="columnheader">Xã hội nông nghiệp</span>
            <span role="columnheader">Kinh tế số & AI</span>
          </div>
          {transitionRows.map((row) => (
            <div className="table-row" role="row" key={row.criterion}>
              <strong role="cell">{row.criterion}</strong>
              <span role="cell">{row.old}</span>
              <span role="cell">{row.now}</span>
            </div>
          ))}
        </div>

        <div className="evidence-grid">
          <article className="vietnam-case">
            <p className="eyebrow">Dẫn chứng tại Việt Nam</p>
            <h3>Kinh tế gig định hình tâm lý mới</h3>
            <p>
              Sự bùng nổ của các nền tảng như Grab, Shopee đã tạo ra một thế hệ lao động tự do.
              Giới trẻ không còn chỉ ưu tiên “ổn định biên chế”, mà đề cao tính linh hoạt
              và trải nghiệm cá nhân.
            </p>
            <img src="/slide-assets/page-08-image-01.jpg" alt="Slide dẫn chứng về lao động nền tảng tại Việt Nam" />
          </article>

          <article className="growth-card">
            <div>
              <p className="eyebrow">Tăng trưởng kinh tế số Việt Nam</p>
              <h3>Quy mô tăng trưởng kéo theo đổi thay ý thức pháp luật số và đạo đức mạng.</h3>
            </div>
            <div className="line-chart" aria-label="Biểu đồ tăng trưởng kinh tế số từ 2022 đến 2025">
              <svg viewBox="0 0 520 260" role="img">
                <defs>
                  <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#d8ff87" stopOpacity="0.42" />
                    <stop offset="100%" stopColor="#36d7d0" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <path d="M40 215 L180 165 L330 130 L480 65 L480 225 L40 225 Z" fill="url(#chartFill)" />
                <polyline
                  points="40,215 180,165 330,130 480,65"
                  fill="none"
                  stroke="#d8ff87"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {chartPoints.map((point, index) => {
                  const coords = [
                    [40, 215],
                    [180, 165],
                    [330, 130],
                    [480, 65],
                  ][index]

                  return (
                    <g key={point.label}>
                      <circle cx={coords[0]} cy={coords[1]} r="13" fill="#d8ff87" />
                      <text x={coords[0]} y="250" textAnchor="middle">
                        {point.label}
                      </text>
                      <text x={coords[0]} y={coords[1] - 24} textAnchor="middle">
                        {point.value}B
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </article>
        </div>
      </section>

      <motion.section
        className="section-band explorer-band"
        id="explorer"
        animate={{ backgroundColor: activeEra.id === 'agriculture' ? '#07100e' : activeEra.id === 'industry' ? '#061115' : '#0d0710' }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className="section-heading">
          <p className="eyebrow">Sản phẩm: Web Explorer</p>
          <h2>Material Footprint Explorer</h2>
          <p>
            Kéo thanh trượt từ Nông nghiệp sang Thời đại Số để thấy tầng ý thức xã hội
            chuyển dịch mượt mà theo nền tảng vật chất.
          </p>
        </div>

        <Tabs value={activeEra.id} onValueChange={(value) => setEraPreset(eraSteps.findIndex((era) => era.id === value))}>
          <TabsList className="era-icons" aria-label="Ba thời kỳ chuyển dịch">
            {eraSteps.map((era) => (
              <TabsTrigger
                className="era-tab"
                key={era.id}
                value={era.id}
                style={{ '--step-color': era.color }}
              >
                <era.icon aria-hidden="true" />
                <span>{era.label}</span>
                <small>{era.range}</small>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="era-slider-panel">
          {/* ── Slider 1: Trình độ LLSX / Công nghệ ── */}
          <label className="era-range-control">
            <span>
              <Factory aria-hidden="true" />
              Trình độ công nghệ sản xuất
            </span>
            <Slider
              className="era-slider"
              min={0}
              max={100}
              step={1}
              value={[technologyLevel]}
              onValueChange={([value]) => setTechnologyLevel(value)}
              aria-label="Trình độ công nghệ sản xuất"
            />
            <small>
              <span>Thô sơ</span>
              <strong>{technologyLevel}%</strong>
              <span>AI / Dữ liệu lớn</span>
            </small>
          </label>

          {/* ── Slider 2: Phương thức lao động ── */}
          <label className="era-range-control">
            <span>
              <Users aria-hidden="true" />
              Phương thức lao động
            </span>
            <Slider
              className="era-slider"
              min={0}
              max={100}
              step={1}
              value={[laborLevel]}
              onValueChange={([value]) => setLaborLevel(value)}
              aria-label="Phương thức lao động"
            />
            <small>
              <span>Cố định / Làng xã</span>
              <strong>{laborLevel}%</strong>
              <span>Remote / Gig</span>
            </small>
          </label>

          {/* ── Composite progress bar ── */}
          <div className="composite-label">
            <SlidersHorizontal aria-hidden="true" />
            <span>Composite: <strong>{compositeValue}%</strong></span>
          </div>
          <motion.div
            className="era-progress-glow"
            animate={{ width: `${compositeValue}%`, backgroundColor: activeEra.color }}
            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
          />
        </div>

        <div className="explorer-layout">
          <motion.div
            className="dashboard-card-shell"
            animate={{ borderColor: activeEra.color, boxShadow: `0 24px 90px ${activeEra.glow}` }}
            transition={{ duration: 0.45 }}
          >
            <Card className="material-panel">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeEra.id}
                  initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <CardHeader>
                    <activeEra.icon aria-hidden="true" />
                    <CardDescription>Đời sống vật chất</CardDescription>
                    <CardTitle>{activeEra.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{activeEra.material}</p>
                  </CardContent>
                </motion.div>
              </AnimatePresence>
            </Card>
          </motion.div>

          <Card className="result-panel animated-result">
            <div className="score-ring" style={{ '--score': `${compositeValue}%` }}>
              <span>{compositeValue}</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEra.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.36, ease: 'easeOut' }}
              >
                <CardHeader>
                  <CardDescription>Ý thức xã hội</CardDescription>
                  <CardTitle>{activeEra.title}</CardTitle>
                  <p>{activeEra.summary}</p>
                </CardHeader>
                <motion.ul
                  className="consciousness-list"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
                  }}
                >
                  {activeEra.signals.map((signal) => (
                    <motion.li
                      key={signal}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0 },
                      }}
                    >
                      <Check aria-hidden="true" />
                      {signal}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </AnimatePresence>
          </Card>

          {/* ── 3 hình thái ý thức xã hội — tự phản ứng từ Zustand ── */}
          <div className="consciousness-panels">
            {[
              { data: psychology, icon: Brain, accentVar: '--psych-accent' },
              { data: morality, icon: Heart, accentVar: '--moral-accent' },
              { data: law, icon: Scale, accentVar: '--law-accent' },
            ].map(({ data, icon: Icon }) => (
              <motion.div
                key={data.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <Card className="consciousness-card">
                  <CardHeader>
                    <div className="consciousness-header">
                      <Icon aria-hidden="true" />
                      <CardTitle>{data.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{data.text}</p>
                    <div className="intensity-bar">
                      <motion.div
                        className="intensity-fill"
                        animate={{ width: `${data.intensity}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                        style={{ backgroundColor: activeEra.color }}
                      />
                      <span className="intensity-value">{data.intensity}%</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="section-band integrity-band">
        <div className="section-heading">
          <p className="eyebrow">Minh bạch AI & Liêm chính</p>
          <h2>Quy trình biên tập có kiểm chứng</h2>
        </div>
        <div className="integrity-list">
          {aiIntegrity.map((item) => (
            <article key={item.title}>
              <item.icon aria-hidden="true" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band slide-gallery" id="slide-goc">
        <div className="section-heading">
          <p className="eyebrow">Slide gốc</p>
          <h2>13 trang từ bản thuyết trình</h2>
        </div>
        <div className="slides-grid">
          {slides.map((slide, index) => (
            <a href={slide.image} className="slide-tile" key={slide.image}>
              <img src={slide.image} alt={`${slide.title} - slide ${index + 1}`} loading="lazy" />
              <span>
                {String(index + 1).padStart(2, '0')} · {slide.title}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="qa-section">
        <FileQuestion aria-hidden="true" />
        <div>
          <p className="eyebrow">Thảo luận & Phản biện</p>
          <h2>Cảm ơn và mời đặt câu hỏi</h2>
        </div>
        <BadgeCheck aria-hidden="true" />
      </section>

      <footer>
        <BookOpen aria-hidden="true" />
        <span>Đời sống quyết định ý thức · Kỷ nguyên số 4.0</span>
        <PanelTop aria-hidden="true" />
      </footer>
    </motion.main>
  )
}

export default App
