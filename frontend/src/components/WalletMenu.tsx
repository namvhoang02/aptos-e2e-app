// https://github.com/aptos-labs/aptos-wallet-adapter/blob/main/packages/wallet-adapter-mui-design/src/WalletMenu.tsx
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// import { useWallet } from "@aptos-labs/wallet-adapter-react";
// import { useState } from "react";

// type WalletMenuProps = {
//   popoverAnchor: HTMLButtonElement | null;
//   handlePopoverClose: () => void;
//   handleNavigate?: () => void;
// };

// export default function WalletMenu({
//   popoverAnchor,
//   handlePopoverClose,
//   handleNavigate,
// }: WalletMenuProps): JSX.Element {
export function WalletMenu(): JSX.Element {
  // const { account, disconnect } = useWallet();
  // const popoverOpen = Boolean(popoverAnchor);
  // const id = popoverOpen ? "wallet-popover" : undefined;

  // const onAccountOptionClicked = () => {
  //   handleNavigate && handleNavigate();
  //   handlePopoverClose();
  // };

  // const handleLogout = () => {
  //   disconnect();
  //   handlePopoverClose();
  // };

  // const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  // const copyAddress = async () => {
  //   await navigator.clipboard.writeText(account?.address!);

  //   setTooltipOpen(true);

  //   setTimeout(() => {
  //     setTooltipOpen(false);
  //   }, 2000);
  // };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Keyboard className="mr-2 h-4 w-4" />
            <span>Keyboard shortcuts</span>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Users className="mr-2 h-4 w-4" />
            <span>Team</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Invite users</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Message</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Team</span>
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Github className="mr-2 h-4 w-4" />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud className="mr-2 h-4 w-4" />
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    // <Popover
    //   id={id}
    //   open={popoverOpen}
    //   anchorEl={popoverAnchor}
    //   onClose={handlePopoverClose}
    //   anchorOrigin={{
    //     vertical: "bottom",
    //     horizontal: "left",
    //   }}
    // >
    //   <List>
    //     <Tooltip
    //       title="Copied"
    //       placement="bottom-end"
    //       open={tooltipOpen}
    //       disableFocusListener
    //       disableHoverListener
    //       disableTouchListener
    //     >
    //       <ListItem disablePadding>
    //         <ListItemButton onClick={copyAddress}>
    //           <ListItemText primary="Copy Address" />
    //         </ListItemButton>
    //       </ListItem>
    //     </Tooltip>
    //     {!!handleNavigate && (
    //       <ListItem disablePadding>
    //         <ListItemButton onClick={onAccountOptionClicked}>
    //           <ListItemText primary="Account" />
    //         </ListItemButton>
    //       </ListItem>
    //     )}
    //     <ListItem disablePadding>
    //       <ListItemButton onClick={handleLogout}>
    //         <ListItemText primary="Logout" />
    //       </ListItemButton>
    //     </ListItem>
    //   </List>
    // </Popover>
  );
}