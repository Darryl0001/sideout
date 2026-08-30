import { Link } from 'react-router-dom';
import { ArrowUpRight, Trophy, ChevronRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useData } from '@/context/DataContext';

// Create a motion-wrapped React Router Link component
const MotionLink = motion(Link);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 110,
      damping: 18,
    },
  },
};

export function PublicHomeView() {
  const { players, matches, locations } = useData();

  const topPlayers = [...players]
    .sort((a, b) => b.stats.winRate - a.stats.winRate)
    .slice(0, 3)
    .map((player, index) => ({
      rank: (index + 1).toString().padStart(2, '0'),
      name: player.displayName,
      avatarUrl: player.avatarUrl,
      winRate: `${player.stats.winRate.toFixed(1)}%`,
      matches: player.stats.totalMatches,
      slug: player.slug,
    }));

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="border-b border-border">
        <motion.div
          className="mx-auto grid max-w-[1500px] lg:grid-cols-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* LEFT CONTENT */}
          <div className="flex min-h-[560px] flex-col justify-between px-6 py-14 sm:px-8 lg:col-span-7 lg:border-r lg:px-10 lg:py-16">
            <div>
              <motion.h1
                className="max-w-3xl text-6xl font-medium leading-[0.9] tracking-[-0.065em] text-foreground sm:text-7xl lg:text-[7.5rem]"
                variants={itemVariants}
              >
                Play.
                <br />
                <span className="text-muted-foreground">Compete.</span>
                <br />
                <span>Climb.</span>
              </motion.h1>

              <motion.p
                className="mt-8 max-w-md text-base leading-7 text-muted-foreground sm:text-lg"
                variants={itemVariants}
              >
                Track every match, follow player rankings, and discover the
                courts shaping your local pickleball community.
              </motion.p>

              <motion.div
                className="mt-9 flex flex-wrap gap-3"
                variants={itemVariants}
              >
                <Button
                  asChild
                  size="lg"
                  className="h-11 rounded-4xl px-5 text-sm font-semibold"
                >
                  <Link to="/leaderboard" className="flex gap-2">
                    See who's on top
                    <ArrowUpRight className="ml-1.5 size-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 rounded-4xl px-5 text-sm font-medium"
                >
                  <Link to="/matches">Browse matches</Link>
                </Button>
              </motion.div>
            </div>

            {/* COMMUNITY STATS */}
            <motion.div
              className="mt-16 grid max-w-xl grid-cols-3 border-t border-border pt-5"
              variants={itemVariants}
            >
              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  {players.length}
                </p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Players
                </p>
              </div>

              <div className="border-l border-border pl-5">
                <p className="text-2xl font-semibold tracking-tight">
                  {matches.length}
                </p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Matches
                </p>
              </div>

              <div className="border-l border-border pl-5">
                <p className="text-2xl font-semibold tracking-tight">
                  {locations.length}
                </p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Courts
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — LEADERBOARD */}
          <div className="flex min-h-[560px] flex-col justify-between px-6 py-10 sm:px-8 lg:col-span-5 lg:px-10 lg:py-12">
            <div>
              <motion.div
                className="flex items-end justify-between border-b border-border pb-4"
                variants={itemVariants}
              >
                <div>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight">
                    Leaderboard
                  </h2>
                </div>
                <Trophy className="size-5 text-muted-foreground" />
              </motion.div>

              {/* Top 3 Player List */}
              <div>
                {topPlayers.map((player, index) => (
                  <MotionLink
                    key={player.rank}
                    to={player.slug ? `/p/${player.slug}` : '/leaderboard'}
                    className="group relative flex items-center justify-between border-b border-border py-7 transition-colors hover:bg-muted/30"
                    variants={itemVariants}
                    whileHover={{ x: 3, transition: { duration: 0.1 } }}
                    whileTap={{ scale: 0.995 }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={[
                          'w-6 font-mono text-xs tabular-nums',
                          index === 0
                            ? 'font-semibold text-foreground'
                            : 'text-muted-foreground',
                        ].join(' ')}
                      >
                        {player.rank}
                      </span>

                      <Avatar className="size-10 border border-border/80">
                        <AvatarImage src={player.avatarUrl} alt={player.name} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                          {player.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase() || <User className="size-4" />}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p
                          className={[
                            'text-base tracking-tight',
                            index === 0 ? 'font-semibold' : 'font-medium',
                          ].join(' ')}
                        >
                          {player.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {player.matches} matches
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <p className="font-mono text-lg font-semibold tabular-nums tracking-tight">
                          {player.winRate}
                        </p>
                        <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                          win rate
                        </p>
                      </div>

                      <ChevronRight className="size-4 text-muted-foreground/30 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </div>
                  </MotionLink>
                ))}
              </div>
            </div>

            {/* Bottom link */}
            <MotionLink
              to="/leaderboard"
              className="group flex items-center justify-between pt-5 text-xs font-medium text-muted-foreground hover:text-foreground"
              variants={itemVariants}
            >
              <span>View full leaderboard</span>
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </MotionLink>
          </div>
        </motion.div>
      </section>

      {/* INTRO SECTION */}
      <section className="mx-auto max-w-[1500px] px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
        <motion.div
          className="grid gap-10 lg:grid-cols-12"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="lg:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              About Sideout
            </p>
          </div>

          <div className="lg:col-span-7">
            <p className="text-2xl font-medium leading-[1.35] tracking-tight sm:text-3xl lg:text-4xl">
              The place to see who's playing, who's winning, and where the next
              game is happening.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}