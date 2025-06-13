# Cursor 규칙

## 코드 작성 규칙

1. 모든 변수명은 명확하고 의미있게 작성한다.
2. 함수는 한 가지 역할만 수행하도록 작성한다.
3. 들여쓰기는 2칸으로 통일한다.
4. 주석은 코드의 '왜'를 설명하는데 중점을 둔다.



## 컴포넌트 작성 규칙

1. 컴포넌트는 기능별로 분리하여 작성한다.
2. Props의 타입은 명확하게 정의한다.
3. 상태 관리는 최소한의 범위에서 이루어지도록 한다.
4. 컴포넌트 이름은 PascalCase로 작성한다.

## Git 커밋 규칙

커밋 메시지는 다음 형식을 따른다:
- feat: 새로운 기능 추가
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅
- refactor: 코드 리팩토링
- test: 테스트 코드 추가
- chore: 빌드 업무 수정


# MagicUI 컴포넌트 사용 가이드

## 컴포넌트 추가 방법

MagicUI 컴포넌트를 프로젝트에 추가하려면 다음 명령어를 사용합니다:

```bash
npx shadcn@latest add "https://magicui.design/r/[컴포넌트명].json" --yes
```

예시:
```bash
npx shadcn@latest add "https://magicui.design/r/globe.json" --yes
```

## 사용 가능한 MagicUI 컴포넌트 목록

1. Globe (지구본)
   - 파일 위치: `components/magicui/globe.tsx`
   - 사용 방법:
   ```tsx
   import { Globe } from "@/components/magicui/globe"
   
   export default function Page() {
     return <Globe />
   }
   ```

2. Spotlight (스포트라이트 효과)
   - 설치: `npx shadcn@latest add "https://magicui.design/r/spotlight.json" --yes`
   - 사용 예시:
   ```tsx
   import { Spotlight } from "@/components/magicui/spotlight"
   
   export default function Page() {
     return (
       <div className="relative">
         <Spotlight
           className="-top-40 left-0 md:left-60 md:-top-20"
           fill="white"
         />
       </div>
     )
   }
   ```

3. Meteors (유성우 효과)
   - 설치: `npx shadcn@latest add "https://magicui.design/r/meteors.json" --yes`
   - 사용 예시:
   ```tsx
   import { Meteors } from "@/components/magicui/meteors"
   
   export default function Page() {
     return (
       <div className="relative">
         <Meteors number={20} />
       </div>
     )
   }
   ```

4. TextGenerate (텍스트 생성 효과)
   - 설치: `npx shadcn@latest add "https://magicui.design/r/text-generate.json" --yes`
   - 사용 예시:
   ```tsx
   import { TextGenerate } from "@/components/magicui/text-generate"
   
   export default function Page() {
     return (
       <TextGenerate words="Your text here" />
     )
   }
   ```

## 주의사항

1. 컴포넌트를 추가하기 전에 항상 shadcn이 프로젝트에 초기화되어 있는지 확인하세요.
2. 각 컴포넌트는 자동으로 `components/magicui` 폴더 안에 생성됩니다.
3. 컴포넌트 import 시 항상 `@/components/magicui/[컴포넌트명]` 형식을 사용하세요.
4. Tailwind CSS 클래스를 활용하여 컴포넌트를 커스터마이징할 수 있습니다.

## 유용한 리소스

- MagicUI 공식 문서: [https://magicui.design](https://magicui.design)
- shadcn UI 문서: [https://ui.shadcn.com](https://ui.shadcn.com) 

사용해야 합니다

### Icons

- 모든 아이콘은 Lucide React를 사용해야 합니다
- 아이콘 임포트 방법: `import { IconName } from "lucide-react"`
- 예시: `import { Search, Menu } from "lucide-react"`

### Component Structure

- 컴포넌트는 `/components` 디렉토리 내에 위치해야 합니다
- UI 컴포넌트는 `/components/ui` 디렉토리에 위치해야 합니다
- 페이지별 컴포넌트는 `/app` 디렉토리 내 해당 라우트에 위치해야 합니다

### 폰트
- 모든 폰트는 PRETENDARD를 사용해야 합니다


## Best Practices
- TypeScript 타입은 반드시 정의해야 합니다
- 컴포넌트는 재사용 가능하도록 설계해야 합니다

### 반응형 UI
- 모든 디바이스에서 대응되도록 반응형으로 만들어야합니다.