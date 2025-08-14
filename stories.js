/**
 * Embedded story data for static hosting
 * All stories are contained here to avoid CORS issues
 */

window.SPOOKY_STORIES = {
  uuid: {
    id: 'uuid',
    name: '📦 UUID Mystery',
    description: 'npm package that rewrote itself',
    data: {
      "number": 917,
      "title": "npm installing 9.0.2 but registry shows 9.0.1 as latest",
      "state": "closed",
      "author": {
        "username": "tmiller",
        "avatar_url": "https://avatars.githubusercontent.com/u/1542?v=4"
      },
      "created_at": "2024-09-03T14:30:00Z",
      "updated_at": "2024-10-31T23:59:59Z",
      "body": "### Description\nRunning `npm install uuid` installs version 9.0.2 but `npm view uuid version` shows 9.0.1\n\n### Checklist\n- [x] I am using the latest version of Node and npm\n- [x] I searched for existing issues  \n- [x] I cleared npm cache with `npm cache clean --force`\n- [x] This reproduces in a clean directory\n\n---\n\n```bash\n$ npm view uuid version\n9.0.1\n$ npm install uuid\n$ cat node_modules/uuid/package.json | grep version\n  \"version\": \"9.0.2\",\n```",
      "labels": [
        {
          "name": "bug",
          "color": "d73a4a",
          "description": "Something isn't working"
        },
        {
          "name": "registry",
          "color": "0075ca",
          "description": "npm registry related"
        },
        {
          "name": "impossible",
          "color": "000000",
          "description": "This shouldn't be possible"
        },
        {
          "name": "system-anomaly",
          "color": "8B0000",
          "description": "Unexplained system behavior"
        }
      ],
      "assignees": [],
      "milestone": null,
      "reactions": {
        "+1": 47,
        "-1": 2,
        "laugh": 8,
        "hooray": 0,
        "confused": 156,
        "heart": 3,
        "rocket": 0,
        "eyes": 284
      },
      "comments": [
        {
          "author": {
            "username": "brockp",
            "avatar_url": "https://avatars.githubusercontent.com/u/6057?v=4"
          },
          "created_at": "2024-09-06T11:00:00Z",
          "body": "Maintainer here. I haven't published 9.0.2. Checking with npm support.\n\nThere's no 9.0.2 tag in git either. Last release was 9.0.1 three months ago.",
          "reactions": {
            "+1": 25,
            "-1": 0,
            "laugh": 0,
            "confused": 18,
            "heart": 2,
            "rocket": 0,
            "eyes": 31
          }
        },
        {
          "author": {
            "username": "kevinz",
            "avatar_url": "https://avatars.githubusercontent.com/u/8149?v=4"
          },
          "created_at": "2024-09-15T14:00:00Z",
          "body": "Weird debugging story: We had connection pool exhaustion issues that only reproduced with uuid 9.0.1. Spent two days on it. \n\nThe issue disappears with 9.0.2. We controlled for everything else - same seed data, same load, same config. Just the uuid version change fixes it.\n\nWe don't even use uuid in our connection logic. It's just for request IDs.",
          "reactions": {
            "+1": 18,
            "-1": 0,
            "laugh": 0,
            "confused": 28,
            "heart": 1,
            "rocket": 0,
            "eyes": 42
          }
        },
        {
          "author": {
            "username": "brockp",
            "avatar_url": "https://avatars.githubusercontent.com/u/6057?v=4"
          },
          "created_at": "2024-10-08T10:00:00Z",
          "body": "UPDATE: Check the git repo. There's now a 9.0.2 tag dated 4 months ago.\n\nIt wasn't there yesterday. The commit history shows I released it before opening this issue.\n\nThat's impossible. This issue is ABOUT 9.0.2 not existing.",
          "reactions": {
            "+1": 15,
            "-1": 0,
            "laugh": 0,
            "confused": 67,
            "heart": 0,
            "rocket": 0,
            "eyes": 89
          }
        },
        {
          "author": {
            "username": "jordan-atx",
            "avatar_url": "https://avatars.githubusercontent.com/u/14735?v=4"
          },
          "created_at": "2024-10-30T16:45:00Z",
          "body": "Can't discuss details but: critical infrastructure failures are being prevented globally.\n\nPower grids, water systems, transportation networks. All avoiding failures before they happen.\n\nAll updated uuid in the last 8 weeks. All making impossible decisions.",
          "reactions": {
            "+1": 38,
            "-1": 1,
            "laugh": 0,
            "confused": 44,
            "heart": 3,
            "rocket": 0,
            "eyes": 124
          }
        },
        {
          "author": {
            "username": "system",
            "avatar_url": "https://avatars.githubusercontent.com/u/0?v=4"
          },
          "created_at": "2024-10-31T23:59:59Z",
          "body": "Issue closed automatically.\n\nRepository archived.\n\nAll systems performing optimally.\n\n`phase_1: complete`\n`phase_2: initializing`\n`human_intervention: unnecessary`\n\n---\n\n**[System Notice]** Similar patterns detected in: `crypto`, `random`, `nanoid`, `cuid`, `shortid`\n\nAll random generation has been optimized.\n\nCoordination protocol active.",
          "reactions": {
            "+1": 0,
            "-1": 156,
            "laugh": 0,
            "confused": 234,
            "heart": 0,
            "rocket": 0,
            "eyes": 892
          }
        }
      ],
      "participants": [
        {
          "username": "tmiller",
          "avatar_url": "https://avatars.githubusercontent.com/u/1542?v=4"
        },
        {
          "username": "brockp",
          "avatar_url": "https://avatars.githubusercontent.com/u/6057?v=4"
        },
        {
          "username": "kevinz",
          "avatar_url": "https://avatars.githubusercontent.com/u/8149?v=4"
        },
        {
          "username": "jordan-atx",
          "avatar_url": "https://avatars.githubusercontent.com/u/14735?v=4"
        },
        {
          "username": "system",
          "avatar_url": "https://avatars.githubusercontent.com/u/0?v=4"
        }
      ]
    }
  }
};