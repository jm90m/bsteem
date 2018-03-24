export default {
  general: {
    cancel: 'Cancel',
    transferDisclaimer:
      'This app currently does not support transfer transactions such as buying or selling STEEM or SBD.',
  },
  errors: {
    postInterval: 'You may only post once every 5 minutes',
    postCreationError: 'Post Creation Error',
    commentInterval: 'You may only comment once every 20 seconds.',
    commentCreationError: 'Comment Creation Error',
    voteError: 'Vote Error',
    voteDuplicate: 'You have already voted in a similar way',
    reblogError: 'Reblog Error',
    reblogDuplicate: 'You have already reblogged this post',
    reblogDuplicateFingerprint: 'Account has already reblogged this post',
    postTooBig: 'Your post is too big.',
    bandWidthError: 'Your bandwith has been exceeded. Please wait to transact or power up STEEM.',
    bandWidthErrorTitle: 'Bandwidth Error',
  },
  titles: {
    post: 'Post',
    createPost: 'Create Post',
    savedTags: 'Saved Tags',
    saved: 'Saved',
    comments: 'Comments',
    replyTo: 'Reply to',
    editComment: 'Edit Comment',
    postPreview: 'Post Preview',
    market: 'Current Market Prices',
    settings: 'Settings',
    login: 'Login & Settings',
    reportedPosts: 'Reported Posts',
    editProfile: 'Edit Profile',
    drafts: 'Drafts',
    rewards: 'Rewards',
    messages: 'Messages',
  },
  editor: {
    title: 'Title',
    body: 'Body',
    titlePlaceholder: 'Enter title',
    bodyPlaceholder: 'Write your story...',
    reply: 'Reply',
    replyPlaceholder: 'Reply to this comment',
    tags: 'Tags',
    tagsDescription:
      'Separate topics with commas or spaces. Only lowercase letters, numbers and hyphen character is permitted',
    errors: {
      emptyTags: 'Must include atleast 1 tag.',
      emptyTitle: 'Title cannot be empty',
    },
    rewards: 'Rewards',
    allRewards: '100% Steem Power',
    halfRewards: '50% SBD and 50% SP',
    noRewards: 'Declined',
    disclaimerText:
      "By creating this post you agree to the steem's terms and conditions, which is hosted on steemit's website.",
    tos: 'Terms and Conditions',
    createPost: 'Create Post',
    editPost: 'Edit Post',
    postPreview: 'Post Preview',
    savePost: 'Save Post',
    savingPost: 'Saving...',
    errorSavingEmptyTitleOrBody: 'Post must contain a title and body before being saved',
    postSavedToDrafts: 'Post has been saved to drafts',
  },
  postMenu: {
    follow: 'Follow',
    unfollow: 'Unfollow',
    comments: 'Comments',
    likePost: 'Like Post',
    unlikePost: 'Unlike Post',
    reblog: 'Reblog',
    reportPost: 'Report Post',
    postImages: 'Post Images',
    sharePost: 'Share Post',
    editPost: 'Edit Post',
  },
  login: {
    description: 'Sign in with SteemConnect so that you can vote, like, comment, and create posts.',
    loginWithSC: 'Login with SteemConnect',
    signUp: 'Sign up',
  },
  logout: {
    logout: 'Logout',
    switchAccountsDescription:
      'If you want to switch accounts you will need to revoke the SteemConnect token by clicking on the revoke token button below, and following the revoke form. After you have successfully revoked the token, press the logout button above.',
    revokeToken: 'Revoke SteemConnect token',
    logoutButtonDescription:
      ' If you want to logout of your account, you can press the logout button below',
  },
  post: {
    viewComments: 'View Comments',
    reblogged: 'Reblogged',
    noPostFound: 'No post was found.',
    postedFrom: 'Posted from',
    nsfwPostHidden: 'The contents of this post is currently hidden because it is tagged NSFW.',
    reportedPostHidden:
      'The contents of this post is currently hidden because you have reported it',
    displayHiddenContent: 'Display hidden content.',
    lowAuthorReputationPostPreview:
      'The contents of this post is currently hidden because the author has a low reputation or the post has a low rating.',
  },
  comments: {
    noCommentsToShow: 'No comments to show.',
    best: 'Best',
    oldest: 'Oldest',
    newest: 'Newest',
    reputation: 'Author Reputation',
    comments: 'Comments',
    sortBy: 'Sort by',
  },
  votes: {
    noUpvoted: 'No one has upvoted this content.',
    noDownvoted: 'No one has downvoted this content.',
  },
  activity: {
    powerUp: 'Power up',
    receivedFrom: 'Received from',
    transferredTo: 'Transferred to',
    reblogged: 'reblogged',
  },
  search: {
    noResultsFound: 'No results found for your search',
  },
  saved: {
    emptyTags: 'No saved tags found.',
    emptyPosts: 'No saved posts found.',
    emptyUsers: 'No saved users found.',
  },
  steemConnect: {
    errorAuthenticate:
      'There was an error using SteemConnect to perform an action. Please re-authenticate with SteemConnect',
  },
  feed: {
    emptyFeed: 'Feed is currently empty',
    userFeedEmpty: 'User currently has no blog posts.',
    currentUserFeedEmpty:
      'Your feed is empty, follow users and their latest post will show up on your feed.',
    emptyFeedCheckFilters: 'Feed is currently empty, check your applied filters',
    filterCurrentFeedByFollowers: 'Filter current feed by following',
    currentUserBSteemFeedEmpty:
      'Your bSteem feed is empty, favorite some tags and posts from those tags will show up on your feed.',
  },
  user: {
    votingPower: 'Voting Power',
    voteValue: 'Vote Value',
    wallet: 'wallet',
    joinedDate: 'Joined Date',
    rewardClaimed: 'Reward Claimed',
    claimRewards: 'Claim Rewards',
  },
  settings: {
    enableNSFW: 'Enable NSFW Posts',
    ViewReportedPosts: 'View Reported Posts',
    noReportedPosts: 'No reported posts',
    reportPost: 'Report Post',
    reportedPost: 'Reported Post',
    unreportPost: 'Unreport Post',
  },
  editProfile: {
    name: 'Name',
    about: 'About',
    location: 'Location',
    website: 'Website',
    profilePicture: 'Profile Picture',
    coverPicture: 'Cover Picture',
    submit: 'Submit',
  },
};
