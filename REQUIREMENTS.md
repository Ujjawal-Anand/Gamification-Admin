# Gamification Admin Portal Requirements

## Project Overview
The Gamification Admin Portal is a Next.js application that allows administrators to create and manage health-focused challenges. The portal will use MongoDB for data storage and NextAuth for authentication.

## Challenge Creation Flow
The challenge creation process will be broken down into intuitive, sequential steps, similar to Airbnb's property listing flow. Each step will be focused on a specific aspect of the challenge, making it easier for administrators to create comprehensive challenges.

### Step 1: Basic Information
- Challenge Name (40 characters max)
- Challenge Category (Activity, Nutrition, Mindfulness, Sleep)
- Challenge Theme (dynamic options based on category)
- Challenge Key (auto-generated based on inputs)
- Challenge Importance (0-5)

### Step 2: Challenge Timeline
- Enrollment Period
  - Start Date
  - End Date (optional)
- Active Dates
  - Start Date
  - End Date
- Visual calendar interface for date selection
- Clear validation messages for date conflicts

### Step 3: Challenge Details
- Headline
- Short Summary
- Hero Image Upload
- Challenge Image Upload
- Benefits
  - Headline
  - Summary (with bullet point support)
  - Image Upload

### Step 4: Challenge Objective
Dynamic form based on selected theme:

**For Activity Challenges:**
- Distance/Steps/Team Challenge Configuration
- Measurement Type Selection
- Target Value Input
- Leaderboard vs Self-tracked Selection

**For Nutrition Challenges:**
- Bingo Configuration
  - Number of Squares (5-25)
  - Square Details
- Quiz Configuration
  - Number of Questions (1-15)
  - Question Details

**For Mindfulness Challenges:**
- Number of Daily Challenges (1-30)
- Challenge Details

**For Sleep Challenges:**
- Target Hours
- Tracking Configuration

### Step 5: Rewards & Recognition
- Points Configuration
- Badge Selection
- Sponsored Reward Details (if applicable)
- Reward Preview

### Step 6: User Eligibility & Communications
- Cohort Selection
- Communication Preferences
  - Notification Types
  - Frequency Settings
  - Message Templates

### Step 7: Additional Features
- Next Best Actions Configuration
- Promo Tile Setup
- Tracking Methods
- Progress Settings

### Step 8: Review & Publish
- Complete Challenge Preview
- Validation Summary
- Publish Options
  - Draft
  - Submit for Review
  - Publish Immediately

### UI/UX Features
1. **Progress Indicator**
   - Clear step numbering
   - Progress bar
   - Ability to jump between steps
   - Save progress automatically

2. **Navigation**
   - Back/Next buttons
   - Step preview
   - Save & Exit option
   - Draft management

3. **Validation**
   - Real-time field validation
   - Step completion indicators
   - Clear error messages
   - Helpful tooltips

4. **Preview**
   - Live preview of challenge
   - Mobile preview option
   - User view simulation

5. **Responsive Design**
   - Mobile-friendly interface
   - Touch-optimized controls
   - Adaptive layouts

6. **Accessibility**
   - Keyboard navigation
   - Screen reader support
   - High contrast options
   - Clear focus states

### Technical Implementation
1. **State Management**
   - Form state persistence
   - Draft saving
   - Auto-save functionality
   - Step validation state

2. **API Integration**
   - Step-by-step API calls
   - Optimistic updates
   - Error handling
   - Retry mechanisms

3. **Performance**
   - Lazy loading of steps
   - Image optimization
   - Form field debouncing
   - Efficient validation

4. **Security**
   - Step validation
   - Data sanitization
   - Permission checks
   - Rate limiting

## Technical Stack
- **Frontend**: Next.js with TypeScript
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **State Management**: React Context/Redux (TBD)
- **Form Handling**: React Hook Form
- **Validation**: Zod/Yup
- **Image Upload**: Cloudinary/AWS S3 (TBD)

## Core Features

### 1. Challenge Management

#### 1.1 Challenge Creation
- **Challenge Name**
  - Type: Short text field
  - Max length: 40 characters
  - Required: Yes
  - Visible to users: Yes

- **Challenge Category**
  - Type: Single select dropdown
  - Options: Activity, Nutrition, Mindfulness, Sleep
  - Required: Yes
  - Visible to users: Yes

- **Challenge Theme**
  - Type: Single select dropdown
  - Options vary based on category:
    - Activity: Distance, Steps, Team Challenge, The Most, Complete X
    - Nutrition: Bingo, Nutrition Quiz
    - Mindfulness: Mini Challenge
    - Sleep: Hours of Sleep
  - Required: Yes
  - Visible to users: Yes

- **Challenge Key**
  - Type: Short text field
  - Format: `<category>_<theme>_<challenge_name>_<sequence#>`
  - Requirements:
    - Must be unique
    - Alphanumeric characters only
    - Not visible to users
    - Immutable after creation
  - Required: Yes

- **Challenge Importance**
  - Type: Single select dropdown
  - Range: 0-5 (integers only)
  - Required: Yes
  - Visible to users: No

- **Sponsored Challenge**
  - Type: Boolean select
  - Options: Yes/No
  - Required: Yes
  - Visible to users: Yes

#### 1.2 Sponsored Challenge Details
Required if challenge is sponsored:
- Brand Name (text)
- Brand Logo (image upload)
- Brand Website (URL)
- Brand Content (text)
- Brand T&Cs (text)

#### 1.3 Challenge Timeline
- **Enrollment Period**
  - Type: Date range selector
  - Start date: Required
  - End date: Optional
  - Validation:
    - Start date must be current or future
    - End date must be after start date
    - Start and end dates cannot be same

- **Active Dates**
  - Type: Date range selector
  - Start date: Required
  - End date: Required
  - Validation:
    - Start date must be after enrollment start
    - End date must be after start date
    - Start and end dates cannot be same

#### 1.4 Challenge Objective
Varies by theme:

**Activity Challenges**
- Distance: Total miles (numeric)
- Steps: Total steps (numeric)
- Team Challenge: Total steps/distance (numeric)
- The Most: Total distance/steps with measurement type

**Nutrition Challenges**
- Bingo: Number of squares (5-25)
- Nutrition Quiz: Number of questions (1-15)

**Mindfulness Challenges**
- Mini Challenge: Number of daily challenges (1-30)

**Sleep Challenges**
- Hours of Sleep: Total hours (numeric)

#### 1.5 Challenge Content
- **Challenge Details**
  - Headline (text)
  - Short summary (text)
  - Image upload
  - Hero image upload

- **Challenge Benefits**
  - Headline (text)
  - Short summary (text, bullet points)
  - Image upload
  - Max 3 bullet points

- **Challenge Reward**
  - Points (numeric)
  - Badge (select from available badges)
  - Sponsored reward (rich text, if sponsored)

#### 1.6 Challenge Configuration
- **Next Best Actions**
  - Multi-select options:
    - Nutrition Widget
    - Recipes
    - Coupons

- **Promo Tile**
  - Image upload
  - Headline
  - Details
  - CTA Link

- **Leaderboard Configuration**
  - Type: Single select
  - Options: Leaderboard/Self tracked
  - Required for Activity challenges

#### 1.7 User Eligibility
- **Cohort Selection**
  - Type: Single select
  - Options:
    - ACI Associates Only
    - All SH customers
    - TBD
  - Default: All users if not specified

#### 1.8 Communications
- **Notification Types**
  - Multi-select options:
    - Reminder (Engaged)
    - Reminder (Lapsed)
    - Reminder (Almost complete)
    - Reminder (Last day)
    - Challenge Completed
    - Challenge Recap (Push)
    - Challenge Recap (Email)

### 2. Activity-Specific Features

#### 2.1 Tracking Methods
- Connected Device
- Manual tracking (except for steps challenges)

#### 2.2 Data Resources
- Summary
- Workout
- Sleep
- Check-in

#### 2.3 Supported Activities
- Workout types:
  - Walking
  - Running
  - Treadmill
  - Cycling
  - Indoor cycling
  - Hiking
  - Basketball
  - General Workout
  - Gym
  - Meditation
  - Swimming
  - Weight lifting
  - Yoga

#### 2.4 Progress Settings
- **Progress Check Frequency**
  - Options: Daily/Hourly

- **Grace Period**
  - Range: 0-3 days
  - Default: 3 days

### 3. Special Challenge Types

#### 3.1 Bingo Challenge
- Minimum squares: 12
- Maximum squares: 25
- Per square:
  - Name
  - Description
  - Sequence (1-25)
  - Key (alphanumeric)

#### 3.2 Mini Challenge
- Daily challenges based on active dates
- Per challenge:
  - Name
  - Description (rich text)
  - Image
  - Examples (rich text)
  - Sequence
  - Key

#### 3.3 Nutrition Quiz
- Questions based on active dates
- Per question:
  - Question text
  - Question key
  - Type (True/False, Multiple Choice, Multi-select)
  - Options (max 5)
  - Correct answer(s)
  - Sequence

## Database Schema

### Challenge Collection
```typescript
interface Challenge {
  name: string;
  category: 'Activity' | 'Nutrition' | 'Mindfulness' | 'Sleep';
  theme: string;
  challengeKey: string;
  importance: number;
  isSponsored: boolean;
  sponsorDetails?: {
    brandName: string;
    brandLogo: string;
    brandWebsite: string;
    brandContent: string;
    brandTerms: string;
  };
  enrollmentPeriod: {
    startDate: Date;
    endDate?: Date;
  };
  activeDates: {
    startDate: Date;
    endDate: Date;
  };
  objective: {
    type: string;
    value: number;
    measurement?: string;
  };
  details: {
    headline: string;
    summary: string;
    image: string;
    heroImage: string;
  };
  benefits: {
    headline: string;
    summary: string;
    image: string;
  };
  nextBestActions: string[];
  promoTile?: {
    image: string;
    headline: string;
    details: string;
    ctaLink: string;
  };
  leaderboard: 'Leaderboard' | 'Self tracked';
  rewards: {
    points?: number;
    badge?: string;
    sponsoredReward?: string;
  };
  cohort?: string;
  communications: string[];
  trackingMethods?: string[];
  dataResource?: string;
  supportedActivities?: string[];
  progressCheck?: 'Daily' | 'Hourly';
  gracePeriod?: number;
  bingoSquares?: Array<{
    name: string;
    description: string;
    sequence: number;
    key: string;
  }>;
  dailyChallenges?: Array<{
    name: string;
    description: string;
    image: string;
    examples: string;
    sequence: number;
    key: string;
  }>;
  quizQuestions?: Array<{
    question: string;
    key: string;
    type: 'True/False' | 'Multiple Choice' | 'Multi-select';
    options?: string[];
    correctAnswers: string[];
    sequence: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  status: 'draft' | 'submitted' | 'active' | 'completed' | 'archived';
}
```

## API Endpoints

### Challenges
- `GET /api/challenges` - List all challenges
- `GET /api/challenges/:id` - Get challenge details
- `POST /api/challenges` - Create new challenge
- `PUT /api/challenges/:id` - Update challenge
- `DELETE /api/challenges/:id` - Delete challenge

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

### File Upload
- `POST /api/upload` - Upload images/files

## Security Requirements
1. All routes must be protected with NextAuth
2. Only admin users can access the portal
3. API endpoints must validate user permissions
4. File uploads must be validated for type and size
5. Challenge keys must be unique and validated
6. Date validations must be enforced server-side

## Performance Requirements
1. Page load time < 2 seconds
2. Image optimization for all uploaded images
3. Pagination for challenge lists
4. Efficient database queries with proper indexing
5. Caching strategy for frequently accessed data

## Future Considerations
1. Real-time updates for challenge progress
2. Analytics dashboard
3. Bulk challenge creation
4. Challenge templates
5. API integration with external health tracking services
6. Mobile responsiveness
7. Internationalization support 