#!/bin/bash
# =============================================================================
# Neon Branch Management Helper
# =============================================================================
# 
# Common operations for managing Neon database branches.
# Requires: neon CLI (npm install -g neonctl)
#
# Usage:
#   ./neon-helper.sh <command> [args]
#
# Commands:
#   dev-branch <name>     Create a development branch
#   preview-branch <pr>   Create a preview branch for PR
#   reset-branch <name>   Reset branch to parent state
#   cleanup-previews      Delete old preview branches
#   connection <branch>   Get connection string for branch
#   restore <timestamp>   Create branch from point in time

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if neon CLI is installed
if ! command -v neon &> /dev/null; then
    echo -e "${RED}Error: neon CLI not found${NC}"
    echo "Install with: npm install -g neonctl"
    exit 1
fi

# =============================================================================
# COMMANDS
# =============================================================================

create_dev_branch() {
    local name=$1
    if [ -z "$name" ]; then
        echo -e "${RED}Error: Branch name required${NC}"
        echo "Usage: ./neon-helper.sh dev-branch <developer-name>"
        exit 1
    fi
    
    local branch_name="dev/$name"
    
    echo -e "${YELLOW}Creating development branch: $branch_name${NC}"
    neon branches create --name "$branch_name" --parent main
    
    echo -e "\n${GREEN}✓ Branch created${NC}"
    echo -e "\nConnection string (pooled):"
    neon connection-string "$branch_name" --pooled
}

create_preview_branch() {
    local pr_number=$1
    if [ -z "$pr_number" ]; then
        echo -e "${RED}Error: PR number required${NC}"
        echo "Usage: ./neon-helper.sh preview-branch <pr-number>"
        exit 1
    fi
    
    local branch_name="preview/pr-$pr_number"
    
    echo -e "${YELLOW}Creating preview branch: $branch_name${NC}"
    neon branches create --name "$branch_name" --parent main
    
    echo -e "\n${GREEN}✓ Branch created${NC}"
    echo -e "\nConnection strings:"
    echo "Pooled:"
    neon connection-string "$branch_name" --pooled
    echo ""
    echo "Direct (for migrations):"
    neon connection-string "$branch_name"
}

reset_branch() {
    local branch=$1
    if [ -z "$branch" ]; then
        echo -e "${RED}Error: Branch name required${NC}"
        echo "Usage: ./neon-helper.sh reset-branch <branch-name>"
        exit 1
    fi
    
    echo -e "${YELLOW}Resetting branch: $branch${NC}"
    read -p "This will overwrite all changes. Continue? (y/N) " confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        neon branches reset "$branch" --parent
        echo -e "\n${GREEN}✓ Branch reset to parent state${NC}"
    else
        echo "Cancelled"
    fi
}

cleanup_previews() {
    local days=${1:-7}
    
    echo -e "${YELLOW}Finding preview branches older than $days days...${NC}"
    
    # List branches and filter
    local branches=$(neon branches list --output json | \
        jq -r --arg days "$days" '.[] | 
            select(.name | startswith("preview/")) | 
            select((.created_at | fromdateiso8601) < (now - ($days | tonumber * 86400))) | 
            .name')
    
    if [ -z "$branches" ]; then
        echo -e "${GREEN}No old preview branches found${NC}"
        return
    fi
    
    echo "Branches to delete:"
    echo "$branches"
    echo ""
    read -p "Delete these branches? (y/N) " confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        echo "$branches" | while read branch; do
            echo "Deleting: $branch"
            neon branches delete "$branch" --force
        done
        echo -e "\n${GREEN}✓ Cleanup complete${NC}"
    else
        echo "Cancelled"
    fi
}

get_connection() {
    local branch=${1:-main}
    local pooled=${2:-true}
    
    echo -e "${YELLOW}Connection string for: $branch${NC}\n"
    
    if [ "$pooled" = "true" ]; then
        echo "Pooled (for application):"
        neon connection-string "$branch" --pooled
    fi
    
    echo ""
    echo "Direct (for migrations):"
    neon connection-string "$branch"
}

create_restore_branch() {
    local timestamp=$1
    if [ -z "$timestamp" ]; then
        echo -e "${RED}Error: Timestamp required${NC}"
        echo "Usage: ./neon-helper.sh restore '2024-01-15T10:30:00Z'"
        exit 1
    fi
    
    local branch_name="restore/$(date +%Y%m%d-%H%M%S)"
    
    echo -e "${YELLOW}Creating restore branch from: $timestamp${NC}"
    neon branches create --name "$branch_name" --parent main --time "$timestamp"
    
    echo -e "\n${GREEN}✓ Restore branch created: $branch_name${NC}"
    echo -e "\nConnection string:"
    neon connection-string "$branch_name" --pooled
}

list_branches() {
    echo -e "${YELLOW}Current branches:${NC}\n"
    neon branches list
}

# =============================================================================
# MAIN
# =============================================================================

show_help() {
    echo "Neon Branch Management Helper"
    echo ""
    echo "Usage: ./neon-helper.sh <command> [args]"
    echo ""
    echo "Commands:"
    echo "  dev-branch <name>      Create a development branch"
    echo "  preview-branch <pr>    Create a preview branch for PR"
    echo "  reset-branch <name>    Reset branch to parent state"
    echo "  cleanup-previews [days] Delete preview branches older than N days (default: 7)"
    echo "  connection [branch]    Get connection string (default: main)"
    echo "  restore <timestamp>    Create branch from point in time"
    echo "  list                   List all branches"
    echo "  help                   Show this help"
    echo ""
    echo "Examples:"
    echo "  ./neon-helper.sh dev-branch alice"
    echo "  ./neon-helper.sh preview-branch 123"
    echo "  ./neon-helper.sh restore '2024-01-15T10:30:00Z'"
    echo "  ./neon-helper.sh cleanup-previews 14"
}

case "$1" in
    dev-branch)
        create_dev_branch "$2"
        ;;
    preview-branch)
        create_preview_branch "$2"
        ;;
    reset-branch)
        reset_branch "$2"
        ;;
    cleanup-previews)
        cleanup_previews "$2"
        ;;
    connection)
        get_connection "$2" "$3"
        ;;
    restore)
        create_restore_branch "$2"
        ;;
    list)
        list_branches
        ;;
    help|--help|-h|"")
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac
